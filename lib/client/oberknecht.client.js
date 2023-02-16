const knechtSocket = require("ws").WebSocket;
const reconnectingKnecht = require("reconnecting-websocket");
const knechtEmitter = require("../emitters/oberknecht.emitter");
const knechtActionEmitter = require("../emitters/oberknecht.action.emitter");
const oberknechtAPI = require("oberknecht-api");

const messageParser = require("../parser/messageParser.js");
const clearchatMsg = require("../parser/CLEARCHAT.Message");
const globaluserstateMsg = require("../parser/GLOBALUSERSTATE.Message");
const noticeMsg = require("../parser/NOTICE.Message");
const privmsgMessage = require("../parser/PRIVMSG.Message");
const usernoticeMsg = require("../parser/USERNOTICE.Message");
const userstateMsg = require("../parser/USERSTATE.Message");
const whisperMsg = require("../parser/WHISPER.Message");

/** @param {privmsgMessage} privmsg @param {string} channelName @param {string} senderUsername @param {string} messageText */
const onPRIVMSGcallback = (privmsg, channelName, senderUsername, messageText) => { };
const onGLOBALUSERSTATEcallback = /**@param {globaluserstateMsg} globaluserstate */ (globaluserstate) => { };
const onCLEARCHATcallback = /**@param {clearchatMsg} clearchat */ (clearchat) => { };
const onNOTICEcallback = /**@param {noticeMsg} notice */ (notice) => { };
const onUSERNOTICEcallback = /**@param {usernoticeMsg} usernotice */ (usernotice) => { };
const onUSERSTATEcallback = /**@param {userstateMsg} userstate */ (userstate) => { };
const onWHISPERcallback = /**@param {whisperMsg} whisper */ (whisper) => { };
const onErrorcallback = /**@param {Error} error */ (error) => { };

const clientOptions = require("../arguments/oberknechtClient.clientOptions");

let i = require("../index");
const getuser = require("../operations/getuser");
const { default: ReconnectingWebSocket } = require("reconnecting-websocket");

class oberknechtClient {
    #secure = Boolean();
    #symbol = Symbol();
    get symbol() { return this.#symbol };
    _options = clientOptions;
    prefix = this._options.prefix ?? "!";
    isConnected = Boolean();
    OberknechtEmitter = new knechtEmitter();
    OberknechtActionEmitter = new knechtActionEmitter();
    API = oberknechtAPI;

    /** @param {clientOptions} options */
    constructor(options) {
        this.#symbol = Symbol(this._options.username);
        i.clientData[this.symbol] = {};
        this._options = i.clientData[this.symbol]._options = (options ?? {});
        this.#secure = (options.secure ?? false);

        i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        i.OberknechtActionEmitter[this.symbol] = this.OberknechtActionEmitter;

        const API = new oberknechtAPI({ token: this._options.token });

        this.API = i.OberknechtAPI[this.symbol] = API;

        process.on("unhandledRejection", e => { this.OberknechtEmitter.emitError("unhandledRejection", e) });
    };

    get #ws_url() {
        return `ws${this.#secure ? "s" : ""}://irc-ws.chat.twitch.tv:${this.#secure ? 433 : 80}`;
    };

    async connect() {
        await this.API.verify();

        const reconnectingKnechtClient = new reconnectingKnecht(this.#ws_url, [], { WebSocket: knechtSocket });

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

    /** @param {string} channel @param {string} message */
    privmsg = (channel, message) => { return require("../operations/privmsg")(this.symbol, channel, message); };
    send = this.privmsg;
    say = this.privmsg;
    /** @param {string} channel @param {string} message */
    action = (channel, message) => { return require("../operations/action")(this.symbol, channel, message); };
    /** @param {string} message */
    sendRaw = (message) => { return require("../operations/sendraw")(this.symbol, message) };
    /** @param {string} channel */
    join = (channel) => { return require("../operations/join")(this.symbol, channel); };
    /** @param {Array<string>} channels */
    joinAll = (channels) => { return require("../operations/joinAll")(this.symbol, channels); };
    /** @param {string} channel */
    part = (channel) => { return require("../operations/part")(this.symbol, channel); };
    /** @param {Array<string>} channels */
    partAll = (channels) => { return require("../operations/partAll")(this.symbol, channels); };
    ping = () => { return require("../operations/ping")(this.symbol); };
    /** @param {string} targetUser @param {string} message */
    whisper = (targetUser, message) => { return require("../operations/whisper")(this.symbol, targetUser, message); };
    /** @param {string} from_broadcaster_id @param {string} to_broadcaster_id */
    shoutout = (from_broadcaster_id, to_broadcaster_id) => { return this.API.shoutout(from_broadcaster_id, to_broadcaster_id); };
    /** @param {string} broadcaster_id @param {string} target_user_id @param {number?} duration @param {string?} reason */
    timeout = (broadcaster_id, target_user_id, duration, reason) => { return this.API.timeout(broadcaster_id, target_user_id, duration, reason); };
    /** @param {string} broadcaster_id @param {string} target_user_id @param {string?} reason */
    ban = (broadcaster_id, target_user_id, reason) => { return this.API.ban(broadcaster_id, target_user_id, reason); };
    /** @param {string} broadcaster_id @param {string} target_user_id */
    unban = (broadcaster_id, target_user_id) => { return this.API.unban(broadcaster_id, target_user_id); };
    untimeout = this.unban;
    /** @param {string} broadcaster_id @param {string} message_id */
    deletemessage = (broadcaster_id, message_id) => { return this.API.deleteMessage(broadcaster_id, message_id); };

    getuser = (usernameorid) => { return this.API.getUsers((i.regex.twitch.usernamereg().test(usernameorid) ? usernameorid : undefined), (i.regex.numregex().test(usernameorid) ? usernameorid : undefined)) };
    getusername = (userid) => { return getuser(this.symbol, userid) };
    getuserid = (username) => { return getuser(this.symbol, username) };

    on = this.OberknechtEmitter.on;
    addListener = this.OberknechtEmitter.addListener;
    off = this.OberknechtEmitter.removeListener;
    remove = this.OberknechtEmitter.removeListener;
    removeAllListeners = this.OberknechtEmitter.removeAllListeners;
    emit = this.OberknechtEmitter.emit;

    /** @param {onPRIVMSGcallback} callback */
    onPRIVMSG = (callback) => { this.on("PRIVMSG", callback); };
    /** @param {onGLOBALUSERSTATEcallback} callback */
    onGLOBALUSERSTATE = (callback) => { this.on("GLOBALUSERSTATE", callback); };
    /** @param {onCLEARCHATcallback} callback */
    onCLEARCHAT = (callback) => { this.on("CLEARCHAT", callback); };
    /** @param {onNOTICEcallback} callback */
    onNOTICE = (callback) => { this.on("NOTICE", callback); };
    /** @param {onUSERNOTICEcallback} callback */
    onUSERNOTICE = (callback) => { this.on("USERNOTICE", callback); };
    /** @param {onUSERSTATEcallback} callback */
    onUSERSTATE = (callback) => { this.on("USERSTATE", callback); };
    /** @param {onWHISPERcallback} callback */
    onWHISPER = (callback) => { this.on("WHISPER", callback); };
    /** @param {onErrorcallback} callback */
    onError = (callback) => { this.on("error", callback); };
    onReady = (callback) => { this.on("irc:ready", callback); };
    onClose = (callback) => { this.on("irc:close", callback); };
};

module.exports = oberknechtClient;