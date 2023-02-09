const knechtSocket = require("ws").WebSocket;
const reconnectingKnecht = require("reconnecting-websocket");
const knechtEmitter = require("../emitters/oberknecht.emitter");
const knechtActionEmitter = require("../emitters/oberknecht.action.emitter");

const messageParser = require("../parser/messageParser.js");
const clearchatMsg = require("../parser/CLEARCHAT.Message");
const globaluserstateMsg = require("../parser/GLOBALUSERSTATE.Message");
const noticeMsg = require("../parser/NOTICE.Message");
const privmsgMessage = require("../parser/PRIVMSG.Message");
const usernoticeMsg = require("../parser/USERNOTICE.Message");
const userstateMsg = require("../parser/USERSTATE.Message");
const whisperMsg = require("../parser/WHISPER.Message");

const onPRIVMSGcallback = /**@param {privmsgMessage} privmsg */ (privmsg) => { };
const onGLOBALUSERSTATEcallback = /**@param {globaluserstateMsg} globaluserstate */ (globaluserstate) => { };
const onCLEARCHATcallback = /**@param {clearchatMsg} clearchat */ (clearchat) => { };
const onNOTICEcallback = /**@param {noticeMsg} notice */ (notice) => { };
const onUSERNOTICEcallback = /**@param {usernoticeMsg} usernotice */ (usernotice) => { };
const onUSERSTATEcallback = /**@param {userstateMsg} userstate */ (userstate) => { };
const onWHISPERcallback = /**@param {whisperMsg} whisper */ (whisper) => { };
const onErrorcallback = /**@param {Error} error */ (error) => { };

const clientOptions = {
    token: String(),
    // Token link generator: https://jubewe.github.io/oauthlink
    username: String(),
    channels: Array(),
    prefix: String(),
    clientid: String() || undefined,
    secure: Boolean()
};

let i = require("../index");
const getuser = require("../operations/api/getuser");
const apiEndpoints = require("../operations/api/apiEndpoints");

class oberknechtClient {
    #secure = Boolean();
    #symbol = Symbol();
    get symbol() { return this.#symbol };
    _options = clientOptions;
    prefix = this._options.prefix ?? "!";
    isConnected = Boolean();
    OberknechtEmitter = new knechtEmitter();
    OberknechtActionEmitter = new knechtActionEmitter();

    /** @param {clientOptions} options */
    constructor(options) {
        this.#symbol = Symbol(this._options.username);
        i.clientData[this.symbol] = {};
        this._options = i.clientData[this.symbol]._options = (options ?? {});
        this.#secure = (options.secure ?? false);

        i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        i.OberknechtActionEmitter[this.symbol] = this.OberknechtActionEmitter;

        process.on("unhandledRejection", e => {this.OberknechtEmitter.emitError("unhandledRejection", e)});
    };

    get #ws_url() {
        return `ws${this.#secure ? "s" : ""}://irc-ws.chat.twitch.tv:${this.#secure ? 433 : 80}`;
    };

    connect() {
        const reconnectingKnechtClient = new reconnectingKnecht(this.#ws_url, [], {
            WebSocket: knechtSocket
        });
        i.reconnectingKnechtClient[this.symbol] = reconnectingKnechtClient;

        reconnectingKnechtClient.addEventListener("open", (response) => {
            reconnectingKnechtClient.send(`CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`);
            reconnectingKnechtClient.send(`PASS oauth:${this._options.token ?? ""}`);
            reconnectingKnechtClient.send(`NICK ${this._options.username ?? ""}`);
            this.OberknechtEmitter.emit(["ws:open", "client:open", "irc:open", "open"], response);
            this.isConnected = true;
        });
        reconnectingKnechtClient.addEventListener("close", (response) => {
            let response_ = response.data;
            this.isConnected = false;
            this.OberknechtEmitter.emit(["ws:close", "client:close", "irc:close", "close"], response_);
        });
        reconnectingKnechtClient.addEventListener("message", (response) => {
            this.OberknechtEmitter.emit(["ws:message"], response);
            response.data.replace(/\r\n$/g, "").split("\r\n").forEach(response_ => {
                messageParser(this.symbol, response_);
            })
        });
        reconnectingKnechtClient.addEventListener("error", (response) => {
            let response_ = response.data;
            this.OberknechtEmitter.emitError(["ws:error", "client:error"], Error(response_));
        });
    };

    privmsg = (channel, message) => { return require("../operations/privmsg")(this.symbol, channel, message); };
    action = (channel, message) => { return require("../operations/action")(this.symbol, channel, message); };
    send = this.privmsg;
    say = this.privmsg;
    joinAll = (channels) => { return require("../operations/joinAll")(this.symbol, channels); };
    join = (channel) => { return require("../operations/join")(this.symbol, channel); };
    partAll = (channels) => { return require("../operations/partAll")(this.symbol, channels); };
    part = (channel) => { return require("../operations/part")(this.symbol, channel); };
    ping = () => { return require("../operations/ping")(this.symbol); };
    whisper = (targetUser, message) => { return require("../operations/whisper")(this.symbol, targetUser, message); };

    getuser = (usernameorid) => { return apiEndpoints.twitch.users(this.symbol, (i.regex.twitch.usernamereg().test(usernameorid) ? usernameorid : undefined), (i.regex.numregex().test(usernameorid) ? usernameorid : undefined)) };
    getusername = (userid) => { return getuser(this.symbol, userid) };
    getuserid = (username) => { return getuser(this.symbol, username) };

    on = this.OberknechtEmitter.on;
    addListener = this.OberknechtEmitter.addListener;
    off = this.OberknechtEmitter.removeListener;
    remove = this.OberknechtEmitter.removeListener;
    removeAllListeners = this.OberknechtEmitter.removeAllListeners;
    emit = this.OberknechtEmitter.emit;

    /** @param {onPRIVMSGcallback} callback */ onPRIVMSG = (callback) => { this.on("PRIVMSG", callback); };
    /** @param {onGLOBALUSERSTATEcallback} callback */ onGLOBALUSERSTATE = (callback) => { this.on("GLOBALUSERSTATE", callback); };
    /** @param {onCLEARCHATcallback} callback */ onCLEARCHAT = (callback) => { this.on("CLEARCHAT", callback); };
    /** @param {onNOTICEcallback} callback */ onNOTICE = (callback) => { this.on("NOTICE", callback); };
    /** @param {onUSERNOTICEcallback} callback */ onUSERNOTICE = (callback) => { this.on("USERNOTICE", callback); };
    /** @param {onUSERSTATEcallback} callback */ onUSERSTATE = (callback) => { this.on("USERSTATE", callback); };
    /** @param {onWHISPERcallback} callback */ onWHISPER = (callback) => { this.on("WHISPER", callback); };
    /** @param {onErrorcallback} callback */ onError = (callback) => { this.on("error", callback); };
    onReady = (callback) => { this.on("irc:ready", callback); };
    onClose = (callback) => { this.on("irc:close", callback); };
};

module.exports = oberknechtClient;