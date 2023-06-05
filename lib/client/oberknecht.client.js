const { oberknechtAPI } = require("oberknecht-api");
const { oberknechtEmitter, oberknechtActionEmitter, oberknechtQueueEmitter } = require("oberknecht-emitters");

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
const getusers = require("../operations/getusers");
const _createws = require("../functions/_createws.js");

class oberknechtClient {
    #secure = Boolean();
    #symbol = Symbol();
    #startTime = Date.now();

    get options() { return i.clientData[this.symbol]?._options ?? {} };
    get clientData() { return i.clientData[this.symbol] };
    get _allIndex() { return i };

    prefix = (this.options.prefix ?? "!");
    API = oberknechtAPI;
    OberknechtEmitter = new oberknechtEmitter();
    OberknechtActionEmitter = new oberknechtActionEmitter({ "useExpectedEventNames": true });
    OberknechtQueueEmitter = new oberknechtQueueEmitter();

    get symbol() { return this.#symbol };
    get uptime() { return (Date.now() - this.#startTime) };
    get channels() { return i.clientData[this.symbol].channels ?? []; };
    get wsUptime() { return ((i.reconnectingKnechtClient[this.symbol]?.[0]?.startTime ?? undefined) ? (Date.now() - i.reconnectingKnechtClient[this.symbol]?.[0]?.startTime) : null) };
    get wsNum() { return i.clientData[this.symbol].wsNum };
    get wsConnections() { return i.clientData[this.symbol].wsConnections };
    get isConnected() { return this.wsConnections.length > 0 };

    static get symbol() { return this.symbol };
    static get uptime() { return this.uptime };
    static get channels() { return this.channels };
    static get wsUptime() { return this.wsUptime };
    static get wsNum() { return this.wsNum };
    static get wsConnections() { return this.wsConnections };
    static get isConnected() { return this.isConnected };

    /** @returns {clientOptions} */
    static get options() { return this.options };
    static get clientData() { return this.clientData };
    static get _allIndex() { return this._allIndex };

    /** @param {clientOptions} options */
    constructor(options) {
        let _options = (options ?? {});
        _options.max_channels_per_ws = (_options.max_channels_per_ws ?? 100);
        i.clientData[this.symbol] = {
            queue: {},
            queueData: {},
            _options: _options,
            wsNum: 0,
            wsConnections: [],
            wsUrl: (`ws${this.#secure ? "s" : ""}://irc-ws.chat.twitch.tv:${this.#secure ? 433 : 80}`),
        };
        this.#secure = (_options.secure ?? false);
        this.#startTime = i.clientData[this.symbol].startTime = Date.now();

        i.OberknechtEmitter[this.symbol] = this.OberknechtEmitter;
        i.OberknechtActionEmitter[this.symbol] = this.OberknechtActionEmitter;
        i.OberknechtQueueEmitter[this.symbol] = this.OberknechtQueueEmitter;

        this.API = new oberknechtAPI({
            token: _options.token,
            ...(options.apiOptions ?? {})
        });

        i.OberknechtAPI[this.symbol] = this.API;

        process.on("unhandledRejection", e => { this.OberknechtEmitter.emitError("unhandledRejection", Error("unhandledRejection", { "cause": e })) });
    };

    async connect() {
        return new Promise(async (resolve) => {
            await this.API.verify()
                .then(() => {
                    i.clientData[this.symbol]._options = {
                        ...i.clientData[this.symbol]._options,
                        clientid: this.API.options.clientid,
                        login: this.API.options.login,
                        userid: this.API.options.userid
                    };
                });
            await _createws(this.symbol);

            return resolve();
        });
    };

    async destroy() {
        return new Promise(async (resolve, reject) => {
            await Promise.all(Object.keys(i.reconnectingKnechtClient[this.symbol]).map(async ws => {
                return await i.reconnectingKnechtClient[this.symbol][ws].close();
            })).catch();

            try {
                i.OberknechtAPI[this.symbol].destroy()
            } catch (e) { }

            delete i.OberknechtAPI[this.symbol];
            delete i.OberknechtActionEmitter[this.symbol];
            delete i.OberknechtEmitter[this.symbol];
            delete i.OberknechtQueueEmitter[this.symbol];
            delete i.reconnectingKnechtClient[this.symbol];
            delete i.clientData[this.symbol];

            return resolve();
        });
    };

    /** @param {string} channel @param {string} message */
    privmsg = async (channel, message) => { return require("../operations/privmsg")(this.symbol, channel, message) };
    send = this.privmsg;
    say = this.privmsg;
    /** @param {string} channel @param {string} message */
    action = (channel, message) => { return require("../operations/action")(this.symbol, channel, message) };
    /** @param {string} message */
    sendRaw = (message) => { return require("../operations/sendraw")(this.symbol, message) };
    /** @param {string} channel */
    join = (channel) => { return require("../operations/join")(this.symbol, channel) };
    /** @param {Array<string>} channels */
    joinAll = (channels) => { return require("../operations/joinAll")(this.symbol, channels) };
    /** @param {string} channel */
    part = (channel) => { return require("../operations/part")(this.symbol, channel) };
    /** @param {Array<string>} channels */
    partAll = (channels) => { return require("../operations/partAll")(this.symbol, channels) };
    ping = () => { return require("../operations/ping")(this.symbol); };
    /** @param {string} targetUser @param {string} message */
    whisper = (targetUser, message) => { return require("../operations/whisper")(this.symbol, targetUser, message) };

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

    getuser = async (login, id, noautofilterids) => { return getusers(this.symbol, login, id, true, noautofilterids) };
    /** @returns {Array<{}>} */
    getusers = async (logins, ids, noautofilterids) => { return getusers(this.symbol, logins, ids, null, noautofilterids) };
    getusername = async (userid) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers([], userid, true).then(u => resolve(u.ids[userid])).catch(reject);
        });
    };
    getuserid = async (username) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers(username, [], true).then(u => resolve(u.logins[username?.toLowerCase()])).catch(reject);
        });
    };


    on = this.OberknechtEmitter.on;
    addListener = this.OberknechtEmitter.addListener;
    off = this.OberknechtEmitter.removeListener;
    remove = this.OberknechtEmitter.removeListener;
    removeAllListeners = this.OberknechtEmitter.removeAllListeners;
    emit = this.OberknechtEmitter.emit;

    /** @param {onPRIVMSGcallback} callback */
    onPRIVMSG = (callback) => { this.on("PRIVMSG", callback) };
    /** @param {onGLOBALUSERSTATEcallback} callback */
    onGLOBALUSERSTATE = (callback) => { this.on("GLOBALUSERSTATE", callback) };
    /** @param {onCLEARCHATcallback} callback */
    onCLEARCHAT = (callback) => { this.on("CLEARCHAT", callback) };
    /** @param {onNOTICEcallback} callback */
    onNOTICE = (callback) => { this.on("NOTICE", callback) };
    /** @param {onUSERNOTICEcallback} callback */
    onUSERNOTICE = (callback) => { this.on("USERNOTICE", callback) };
    /** @param {onUSERSTATEcallback} callback */
    onUSERSTATE = (callback) => { this.on("USERSTATE", callback) };
    /** @param {onWHISPERcallback} callback */
    onWHISPER = (callback) => { this.on("WHISPER", callback) };
    /** @param {onErrorcallback} callback */
    onError = (callback) => { this.on("error", callback) };
    onReady = (callback) => { this.on("ready", callback) };
    onClose = (callback) => { this.on("irc:close", callback) };
};

module.exports = oberknechtClient;