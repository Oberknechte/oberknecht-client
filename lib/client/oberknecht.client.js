const knechtSocket = require("ws").WebSocket;
const messageParser = require("../parser/messageParser.js");

const reconnectingKnecht = require("reconnecting-websocket");

const knechtEmitter = require("../emitters/oberknecht.emitter");
const knechtActionEmitter = require("../emitters/oberknecht.action.emitter");

const clearchatMsg = require("../parser/CLEARCHAT.Message");
const globaluserstateMsg = require("../parser/GLOBALUSERSTATE.Message");
const noticeMsg = require("../parser/NOTICE.Message");
const privmsgMessage = require("../parser/PRIVMSG.Message");
const usernoticeMsg = require("../parser/USERNOTICE.Message");
const userstateMsg = require("../parser/USERSTATE.Message");
const whisperMsg = require("../parser/WHISPER.Message");

let onPRIVMSGcallback = /**@param {privmsgMessage} privmsg */ (privmsg) => { privmsg };
let onGLOBALUSERSTATEcallback = /**@param {globaluserstateMsg} globaluserstate */ (globaluserstate) => { };
let onCLEARCHATcallback = /**@param {clearchatMsg} clearchat */ (clearchat) => { };
let onNOTICEcallback = /**@param {noticeMsg} notice */ (notice) => { };
let onUSERNOTICEcallback = /**@param {usernoticeMsg} usernotice */ (usernotice) => { };
let onUSERSTATEcallback = /**@param {userstateMsg} userstate */ (userstate) => { };
let onWHISPERcallback = /**@param {whisperMsg} whisper */ (whisper) => { };
let onErrorcallback = /**@param {Error} error */ (error) => { };

const clientOptions = {
    token: String(),
    username: String(),
    secure: Boolean(),
    channels: Array(),
    prefix: String()
};

let i = require("../index");

const OberknechtEmitter = new knechtEmitter();
const OberknechtActionEmitter = new knechtActionEmitter();

class oberknechtClient {
    #secure = Boolean();
    #symbol = Symbol();
    get symbol() { return this.#symbol };
    _options = clientOptions;
    prefix = this._options.prefix ?? "!";
    isConnected = Boolean();
    OberknechtEmitter = OberknechtEmitter;
    OberknechtActionEmitter = OberknechtActionEmitter;

    /**
     * @param {clientOptions} options 
     */
    constructor(options) {
        this.#symbol = Symbol(this._options.username);
        i = require("../index");
        i.clientData[this.symbol] = {};
        this._options = i.clientData[this.symbol]._options = (options ?? {});
        this.#secure = (options.secure ?? false);

        i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        i.OberknechtActionEmitter[this.symbol] = this.OberknechtActionEmitter;

        // console.log(i);
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

            this.isConnected = true;
        });
        reconnectingKnechtClient.addEventListener("close", (response) => {
            let response_ = response.data;
            OberknechtEmitter.emit(["ws:close", "client:close", "irc:close", "close"], response_);
            this.isConnected = true;
        });
        reconnectingKnechtClient.addEventListener("message", (response) => {
            OberknechtEmitter.emit(["ws:message"], response);
            response.data.replace(/\r\n$/g, "").split("\r\n").forEach(response_ => {
                messageParser(this.symbol, response_);
            })
        });
        reconnectingKnechtClient.addEventListener("error", (response) => {
            let response_ = response.data;
            OberknechtEmitter.emit(["ws:error", "client:error", "error"], response_);
        });
    };

    privmsg = (channel, message) => {
        return require("../operations/privmsg")(this.symbol, channel, message);
    };
    send = this.privmsg;
    say = this.privmsg;
    joinAll = (channels) => {
        return require("../operations/joinAll")(this.symbol, channels);
    };
    join = (channel) => {
        return require("../operations/join")(this.symbol, channel);
    };
    partAll = (channels) => {
        return require("../operations/partAll")(this.symbol, channels);
    };
    part = (channel) => {
        return require("../operations/part")(this.symbol, channel);
    };
    ping = () => {
        return require("../operations/ping")(this.symbol);
    };


    on = OberknechtEmitter.on;
    addListener = this.OberknechtEmitter.addListener;
    off = this.OberknechtEmitter.removeListener;
    remove = this.OberknechtEmitter.removeListener;
    removeAllListeners = this.OberknechtEmitter.removeAllListeners;
    emit = this.OberknechtEmitter.emit;

    /** @param {onPRIVMSGcallback} callback */
    onPRIVMSG = (callback) => {
        this.on("PRIVMSG", callback);
    };
    /** @param {onGLOBALUSERSTATEcallback} callback */
    onGLOBALUSERSTATE = (callback) => {
        this.on("GLOBALUSERSTATE", callback);
    };

    /** @param {onCLEARCHATcallback} callback */
    onCLEARCHAT = (callback) => {
        this.on("CLEARCHAT", callback);
    };

    /** @param {onNOTICEcallback} callback */
    onNOTICE = (callback) => {
        this.on("NOTICE", callback);
    };

    /** @param {onUSERNOTICEcallback} callback */
    onUSERNOTICE = (callback) => {
        this.on("USERNOTICE", callback);
    };

    /** @param {onUSERSTATEcallback} callback */
    onUSERSTATE = (callback) => {
        this.on("USERSTATE", callback);
    };

    /** @param {onWHISPERcallback} callback */
    onWHISPER = (callback) => {
        this.on("WHISPER", callback);
    };

    /** @param {onErrorcallback} callback */
    onError = (callback) => {
        this.on("error", callback);
    };
    
    onReady = (callback) => {
        this.on("irc:ready", callback);
    };

    onClose = (callback) => {
        this.on("irc:close", callback);
    };
};

module.exports = oberknechtClient;