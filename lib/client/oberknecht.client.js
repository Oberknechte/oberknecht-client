const reconnectingKnecht = require("reconnecting-websocket");
const knechtSocket = require("ws").WebSocket;
const messageParser = require("../parser/messageParser.js");

class clientOptions {
    static token = String();
    static username = String();
    static secure = Boolean();
    static channels = Array();
};

let i = () => {return require("../index")};

class oberknechtClient {
    #secure = Boolean();
    _options = clientOptions;

    /**
     * @param {clientOptions} options 
     */
    constructor(options){
        this._options = i().clientData._options = (options ?? {});
        this.#secure = (this._options.secure ?? false);
    };

    get #ws_url() {
        return `ws${this.#secure?"s":""}://irc-ws.chat.twitch.tv:${this.#secure?433:80}`;
    };

    connect() {
        i().reconnectingKnecht = new reconnectingKnecht(this.#ws_url, [], {
            WebSocket: knechtSocket
        });

        i().reconnectingKnecht.addEventListener("open", (response) => {
            i().reconnectingKnecht.send(`CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`);
            i().reconnectingKnecht.send(`PASS oauth:${this._options.token ?? ""}`);
            i().reconnectingKnecht.send(`NICK ${this._options.username ?? ""}`);
        });
        i().reconnectingKnecht.addEventListener("close", (response) => {
            let response_ = response.data;
            i().OberknechtEmitter.emit(["ws:close", "client:close", "irc:close", "close"], response_);
        });
        i().reconnectingKnecht.addEventListener("message", (response) => {
            i().OberknechtEmitter.emit(["ws:message"], response);
            response.data.replace(/\r\n$/g, "").split("\r\n").forEach(response_ => {
                messageParser(response_);
            })
        });
        i().reconnectingKnecht.addEventListener("error", (response) => {
            let response_ = response.data;
            i().OberknechtEmitter.emit(["ws:error","client:error","error"], response_);
        });
    };
    
    privmsg = require("../operations/privmsg");
    send = require("../operations/privmsg");
    join = require("../operations/join");
    joinAll = require("../operations/joinAll");
    part = require("../operations/part");
    partAll = require("../operations/partAll");
    ping = require("../operations/ping");

    on = i().OberknechtEmitter.on;
    addListener = i().OberknechtEmitter.addListener;
    off = i().OberknechtEmitter.removeListener;
    remove = i().OberknechtEmitter.removeListener;
    removeAllListeners = i().OberknechtEmitter.removeAllListeners;
    emit = i().OberknechtEmitter.emit;
};

module.exports = oberknechtClient;