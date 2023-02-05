const reconnectingKnecht = require("reconnecting-websocket");
const knechtSocket = require("ws").WebSocket;
const messageParser = require("../parser/messageParser.js");

const clearchatMsg = require("../parser/CLEARCHAT.Message");
const globaluserstateMsg = require("../parser/globaluserstate.Message");
const noticeMsg = require("../parser/NOTICE.Message");
const privmsgMessage = require("../parser/PRIVMSG.Message");
const usernoticeMsg = require("../parser/USERNOTICE.Message");
const userstateMsg = require("../parser/USERSTATE.Message");
const whisperMsg = require("../parser/WHISPER.Message");

let onPRIVMSGcallback = /**@param {privmsgMessage} privmsg */ (privmsg) => {privmsg};
let onGLOBALUSERSTATEcallback = /**@param {globaluserstateMsg} globaluserstate */ (globaluserstate) => {};
let onCLEARCHATcallback = /**@param {clearchatMsg} clearchat */ (clearchat) => {};
let onNOTICEcallback = /**@param {noticeMsg} notice */ (notice) => {};
let onUSERNOTICEcallback = /**@param {usernoticeMsg} usernotice */ (usernotice) => {};
let onUSERSTATEcallback = /**@param {userstateMsg} userstate */ (userstate) => {};
let onWHISPERcallback = /**@param {whisperMsg} whisper */ (whisper) => {};

const clientOptions = {
    token: String(),
    username: String(),
    secure: Boolean(),
    channels: Array(),
    prefix: String()
};

let i = require("../index");

class oberknechtClient {
    #secure = Boolean();
    _options = clientOptions;
    prefix = this._options.prefix ?? "!";

    /**
     * @param {clientOptions} options 
     */
    constructor(options){
        this._options = i.clientData._options = (options ?? {});
        this.#secure = (options.secure ?? false);
        i = require("../index");
    };

    get #ws_url() {
        return `ws${this.#secure?"s":""}://irc-ws.chat.twitch.tv:${this.#secure?433:80}`;
    };

    connect() {
        i.reconnectingKnecht = new reconnectingKnecht(this.#ws_url, [], {
            WebSocket: knechtSocket
        });

        i.reconnectingKnecht.addEventListener("open", (response) => {
            i.reconnectingKnecht.send(`CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`);
            i.reconnectingKnecht.send(`PASS oauth:${this._options.token ?? ""}`);
            i.reconnectingKnecht.send(`NICK ${this._options.username ?? ""}`);
        });
        i.reconnectingKnecht.addEventListener("close", (response) => {
            let response_ = response.data;
            i.OberknechtEmitter.emit(["ws:close", "client:close", "irc:close", "close"], response_);
        });
        i.reconnectingKnecht.addEventListener("message", (response) => {
            i.OberknechtEmitter.emit(["ws:message"], response);
            response.data.replace(/\r\n$/g, "").split("\r\n").forEach(response_ => {
                messageParser(response_);
            })
        });
        i.reconnectingKnecht.addEventListener("error", (response) => {
            let response_ = response.data;
            i.OberknechtEmitter.emit(["ws:error","client:error","error"], response_);
        });
    };

    privmsg = require("../operations/privmsg");
    send = require("../operations/privmsg");
    join = require("../operations/join");
    joinAll = require("../operations/joinAll");
    part = require("../operations/part");
    partAll = require("../operations/partAll");
    ping = require("../operations/ping");
    
    on = i.OberknechtEmitter.on;

    /**
     * @param {onPRIVMSGcallback} callback 
     */
    onPRIVMSG = (callback) => {
        this.on("PRIVMSG", callback);
    };
    /**
     * @param {onGLOBALUSERSTATEcallback} callback 
     */
    onGLOBALUSERSTATE = (callback) => {
        this.on("GLOBALUSERSTATE", callback);
    };
    
    /**
     * @param {onCLEARCHATcallback} callback 
     */
    onCLEARCHAT = (callback) => {
        this.on("CLEARCHAT", callback);
    };
    
    /**
     * @param {onNOTICEcallback} callback 
     */
    onNOTICE = (callback) => {
        this.on("NOTICE", callback);
    };
    
    /**
     * @param {onUSERNOTICEcallback} callback 
     */
    onUSERNOTICE = (callback) => {
        this.on("USERNOTICE", callback);
    };
    
    /**
     * @param {onUSERSTATEcallback} callback 
     */
    onUSERSTATE = (callback) => {
        this.on("USERSTATE", callback);
    };
    
    /**
     * @param {onWHISPERcallback} callback 
     */
    onWHISPER = (callback) => {
        this.on("WHISPER", callback);
    };

    addListener = i.OberknechtEmitter.addListener;
    off = i.OberknechtEmitter.removeListener;
    remove = i.OberknechtEmitter.removeListener;
    removeAllListeners = i.OberknechtEmitter.removeAllListeners;
    emit = i.OberknechtEmitter.emit;
};

module.exports = oberknechtClient;