"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtClient = void 0;
let oberknecht_api_1 = require("oberknecht-api");
let oberknecht_emitters_1 = require("oberknecht-emitters");
const onPRIVMSGcallback = (privmsg, channelName, senderUsername, messageText) => { };
const onGLOBALUSERSTATEcallback = (globaluserstate) => { };
const onCLEARCHATcallback = (clearchat) => { };
const onNOTICEcallback = (notice) => { };
const onUSERNOTICEcallback = (usernotice) => { };
const onUSERSTATEcallback = (userstate) => { };
const onWHISPERcallback = (whisper) => { };
const onErrorcallback = (error) => { };
const onAutojoinCallback = (channels) => { };
const onEmptyCallback = () => { };
let getusers_1 = require("../operations/getusers");
let _createws_1 = require("../functions/_createws");
let __1 = require("..");
let privmsg_1 = require("../operations/privmsg");
let ping_1 = require("../operations/ping");
let whisper_1 = require("../operations/whisper");
let partAll_1 = require("../operations/partAll");
let joinAll_1 = require("../operations/joinAll");
let part_1 = require("../operations/part");
let join_1 = require("../operations/join");
let sendraw_1 = require("../operations/sendraw");
let action_1 = require("../operations/action");
let getuser_1 = require("../operations/getuser");
let clientSymNum = 0;
class oberknechtClient {
    #symbol = `oberknechtClient-${clientSymNum++}`;
    #secure;
    #startTime = Date.now();
    get options() {
        return __1.i.clientData[this.symbol]?._options ?? {};
    }
    get clientData() {
        return __1.i.clientData[this.symbol];
    }
    get _allIndex() {
        return __1.i;
    }
    prefix = this.options.prefix ?? "!";
    API = new oberknecht_api_1.oberknechtAPI({ skipCreation: true, token: undefined });
    OberknechtEmitter = new oberknecht_emitters_1.oberknechtEmitter();
    OberknechtActionEmitter = new oberknecht_emitters_1.oberknechtActionEmitter({ useExpectedEventNames: true });
    OberknechtQueueEmitter = new oberknecht_emitters_1.oberknechtQueueEmitter();
    get symbol() {
        return this.#symbol;
    }
    get uptime() {
        return Date.now() - this.#startTime;
    }
    get channels() {
        return __1.i.clientData[this.symbol].channels ?? [];
    }
    get wsUptime() {
        return __1.i.reconnectingKnechtClient[this.symbol]?.[0]?.startTime ?? undefined
            ? Date.now() - __1.i.reconnectingKnechtClient[this.symbol]?.[0]?.startTime
            : null;
    }
    get wsNum() {
        return __1.i.clientData[this.symbol].wsNum;
    }
    get wsConnections() {
        return __1.i.clientData[this.symbol].wsConnections;
    }
    get isConnected() {
        return this.wsConnections.length > 0;
    }
    static get symbol() {
        return this.symbol;
    }
    static get uptime() {
        return this.uptime;
    }
    static get channels() {
        return this.channels;
    }
    static get wsUptime() {
        return this.wsUptime;
    }
    static get wsNum() {
        return this.wsNum;
    }
    static get wsConnections() {
        return this.wsConnections;
    }
    static get isConnected() {
        return this.isConnected;
    }
    static get options() {
        return this.options;
    }
    static get clientData() {
        return this.clientData;
    }
    static get _allIndex() {
        return this._allIndex;
    }
    constructor(options) {
        if (!options?.token)
            throw Error("options.token is undefined");
        let _options = (options ?? {});
        _options.max_channels_per_ws = _options.max_channels_per_ws ?? 100;
        _options.delayBetweenMessages = _options.delayBetweenMessages ?? 10;
        _options.asyncDelay = options.asyncDelay ?? 50;
        __1.i.clientData[this.symbol] = {
            queue: {},
            queueData: {},
            _options: _options,
            wsNum: 0,
            wsConnections: [],
            wsUrl: `ws${this.#secure ? "s" : ""}://irc-ws.chat.twitch.tv:${this.#secure ? 433 : 80}`,
        };
        this.#secure = _options.secure ?? false;
        this.#startTime = __1.i.clientData[this.symbol].startTime = Date.now();
        __1.i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        __1.i.OberknechtActionEmitter[this.symbol] = this.OberknechtActionEmitter;
        __1.i.OberknechtQueueEmitter[this.symbol] = this.OberknechtQueueEmitter;
        this.API = new oberknecht_api_1.oberknechtAPI({
            token: _options.token,
            ...(options.apiOptions ?? {}),
        });
        __1.i.OberknechtAPI[this.symbol] = this.API;
        process.on("unhandledRejection", (e) => {
            this.OberknechtEmitter.emitError("unhandledRejection", Error("unhandledRejection", { cause: e }));
        });
    }
    async connect() {
        return new Promise(async (resolve, reject) => {
            await this.API.verify()
                .then(() => {
                __1.i.clientData[this.symbol]._options = {
                    ...__1.i.clientData[this.symbol]._options,
                    clientid: this.API.options.clientid,
                    login: this.API.options.login,
                    userid: this.API.options.userid,
                };
            })
                .catch(reject);
            await (0, _createws_1._createws)(this.symbol);
            return resolve();
        });
    }
    async destroy() {
        return new Promise(async (resolve, reject) => {
            await Promise.all(Object.keys(__1.i.reconnectingKnechtClient[this.symbol]).map(async (ws) => {
                return await __1.i.reconnectingKnechtClient[this.symbol][ws].close();
            })).catch();
            try {
                __1.i.OberknechtAPI[this.symbol].destroy();
            }
            catch (e) { }
            delete __1.i.OberknechtAPI[this.symbol];
            delete __1.i.OberknechtActionEmitter[this.symbol];
            delete __1.i.OberknechtEmitter[this.symbol];
            delete __1.i.OberknechtQueueEmitter[this.symbol];
            delete __1.i.reconnectingKnechtClient[this.symbol];
            delete __1.i.clientData[this.symbol];
            return resolve();
        });
    }
    privmsg = (channel, message) => {
        return (0, privmsg_1.privmsg)(this.symbol, channel, message);
    };
    send = this.privmsg;
    say = this.privmsg;
    action = (channel, message) => {
        return (0, action_1.action)(this.symbol, channel, message);
    };
    sendRaw = (message) => {
        return (0, sendraw_1.sendraw)(this.symbol, message);
    };
    join = (channel) => {
        return (0, join_1.join)(this.symbol, channel);
    };
    joinAll = (channels) => {
        return (0, joinAll_1.joinAll)(this.symbol, channels);
    };
    part = (channel) => {
        return (0, part_1.part)(this.symbol, channel);
    };
    partAll = (channels) => {
        return (0, partAll_1.partAll)(this.symbol, channels);
    };
    ping = () => {
        return (0, ping_1.ping)(this.symbol);
    };
    whisper = (targetUser, message, customtoken) => {
        return (0, whisper_1.whisper)(this.symbol, targetUser, message, customtoken);
    };
    shoutout = this.API.shoutout;
    timeout = this.API.timeout;
    ban = this.API.ban;
    unban = this.API.unban;
    untimeout = this.unban;
    deleteMessage = this.API.deleteMessage;
    announce = this.API.announce;
    updateChatSettings = this.API.updateChatSettings;
    slow = this.API.slow;
    slowOff = this.API.slowOff;
    followers = this.API.followers;
    followersOff = this.API.followersOff;
    subscribers = this.API.subscribers;
    subscribersOff = this.API.subscribersOff;
    r9k = this.API.r9k;
    uniqueChat = this.r9k;
    r9kOff = this.API.r9kOff;
    uniqueChatOff = this.r9kOff;
    chatdelay = this.API.chatdelay;
    chatdelayOff = this.API.chatdelayOff;
    getChatSettings = this.API.getChatSettings;
    mod = this.API.mod;
    unmod = this.API.unmod;
    vip = this.API.vip;
    unvip = this.API.unvip;
    updateColor = this.API.updateColor;
    getColor = this.API.getColor;
    raid = this.API.raid;
    unraid = this.API.unraid;
    getStreams = this.API.getStreams;
    getuser = async (login, id, noautofilterids) => {
        return await (0, getuser_1.getuser)(this.symbol, login, id, noautofilterids);
    };
    getusers = async (logins, ids, noautofilterids) => {
        return (0, getusers_1.getusers)(this.symbol, logins, ids, noautofilterids);
    };
    getusername = async (userid) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers([], userid, true)
                .then((u) => resolve(u.ids[userid]))
                .catch(reject);
        });
    };
    getuserid = async (username) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers(username, [], true)
                .then((u) => resolve(u.logins[username?.toLowerCase()]))
                .catch(reject);
        });
    };
    on = this.OberknechtEmitter.on;
    addListener = this.OberknechtEmitter.addListener;
    off = this.OberknechtEmitter.removeListener;
    remove = this.OberknechtEmitter.removeListener;
    removeAllListeners = this.OberknechtEmitter.removeAllListeners;
    emit = this.OberknechtEmitter.emit;
    onPRIVMSG = (callback) => {
        this.on("PRIVMSG", callback);
    };
    onGLOBALUSERSTATE = (callback) => {
        this.on("GLOBALUSERSTATE", callback);
    };
    onCLEARCHAT = (callback) => {
        this.on("CLEARCHAT", callback);
    };
    onNOTICE = (callback) => {
        this.on("NOTICE", callback);
    };
    onUSERNOTICE = (callback) => {
        this.on("USERNOTICE", callback);
    };
    onUSERSTATE = (callback) => {
        this.on("USERSTATE", callback);
    };
    onWHISPER = (callback) => {
        this.on("WHISPER", callback);
    };
    onError = (callback) => {
        this.on("error", callback);
    };
    onReady = (callback) => {
        this.on("ready", callback);
    };
    onClose = (callback) => {
        this.on("irc:close", callback);
    };
    onAutojoin = (callback) => {
        this.on("autojoin", callback);
    };
}
exports.oberknechtClient = oberknechtClient;
