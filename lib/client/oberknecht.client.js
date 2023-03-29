const { oberknechtAPI } = require("oberknecht-api");
const { oberknechtEmitter, oberknechtActionEmitter, oberknechtQueueEmitter } = require("oberknecht-emitters");

const clearchatMsg = require("../parser/CLEARCHAT.Message");
const globaluserstateMsg = require("../parser/GLOBALUSERSTATE.Message");
const noticeMsg = require("../parser/NOTICE.Message");
const privmsgMessage = require("../parser/PRIVMSG.Message");
const usernoticeMsg = require("../parser/USERNOTICE.Message");
const userstateMsg = require("../parser/USERSTATE.Message");
const whisperMsg = require("../parser/WHISPER.Message");

const APIchatSettings = require("oberknecht-api/lib/arguments/chatSettings");
const APIgetStreamsFilters = require("oberknecht-api/lib/arguments/getStreamsFilters");

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
const _createws = require("../functions/_createws.js");

class oberknechtClient {
    #secure = Boolean();
    #symbol = Symbol();
    #startTime = Date.now();

    /**@returns {clientOptions} */
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
            token: _options?.token,
            startPath: _options.apiStartPath,
            saveIDs: _options.saveIDs
        });
        i.OberknechtAPI[this.symbol] = this.API;

        process.on("unhandledRejection", e => { this.OberknechtEmitter.emitError("unhandledRejection", e) });
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
    privmsg = (channel, message) => { return require("../operations/privmsg")(this.symbol, channel, message) };
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
    /** @param {string} from_broadcaster_id @param {string} to_broadcaster_id */
    shoutout = (from_broadcaster_id, to_broadcaster_id) => { return this.API.shoutout(from_broadcaster_id, to_broadcaster_id) };
    /** @param {string} broadcaster_id @param {string} target_user_id @param {number?} duration @param {string?} reason */
    timeout = (broadcaster_id, target_user_id, duration, reason) => { return this.API.timeout(broadcaster_id, target_user_id, duration, reason) };
    /** @param {string} broadcaster_id @param {string} target_user_id @param {string?} reason */
    ban = (broadcaster_id, target_user_id, reason) => { return this.API.ban(broadcaster_id, target_user_id, reason) };
    /** @param {string} broadcaster_id @param {string} target_user_id */
    unban = (broadcaster_id, target_user_id) => { return this.API.unban(broadcaster_id, target_user_id) };
    untimeout = this.unban;
    /** @param {string} broadcaster_id @param {string} message_id */
    deleteMessage = (broadcaster_id, message_id) => { return this.API.deleteMessage(broadcaster_id, message_id) };

    announce = (broadcaster_id, message, color) => { return this.API.announce(broadcaster_id, message, color) };
    /** @param {APIchatSettings} settings */
    updateChatSettings = (broadcaster_id, settings) => { return this.API.updateChatSettings(broadcaster_id, settings) };

    slow = (broadcaster_id, wait_time) => { return this.API.slow(broadcaster_id, wait_time) };
    slowOff = (broadcaster_id) => { return this.API.slowOff(broadcaster_id) };

    followers = (broadcaster_id, duration) => { return this.API.followers(broadcaster_id, duration) };
    followersOff = (broadcaster_id) => { return this.API.followersOff(broadcaster_id) };

    subscribers = (broadcaster_id) => { return this.API.subscribers(broadcaster_id) };
    subscribersOff = (broadcaster_id) => { return this.API.subscribersOff(broadcaster_id) };

    r9k = (broadcaster_id) => { return this.API.r9k(broadcaster_id) };
    uniqueChat = this.r9k;
    r9kOff = (broadcaster_id) => { return this.API.r9kOff(broadcaster_id) };
    uniqueChatOff = this.r9kOff;

    chatdelay = (broadcaster_id, duration) => { return this.API.chatdelay(broadcaster_id, duration) };
    chatdelayOff = (broadcaster_id) => { return this.API.chatdelayOff(broadcaster_id) };

    getChatSettings = (broadcaster_id) => { return this.API.getChatSettings(broadcaster_id) };

    mod = (user_id) => { return this.API.mod(user_id) };
    unmod = (user_id) => { return this.API.unmod(user_id) };

    vip = (user_id) => { return this.API.vip(user_id) };
    unvip = (user_id) => { return this.API.unvip(user_id) };

    /** @param {"blue" | "blue_violet" | "cadet_blue" | "chocolate" | "coral" | "dodger_blue" | "firebrick" | "golden_rod" | "green" | "hot_pink" | "orange_red" | "red" | "sea_green" | "spring_green" | "yellow_green"} color */
    updateColor = (color) => { return this.API.updateColor(color) };
    getColor = (userid) => { return this.API.getColor(userid) };

    raid = (from_broadcaster_id, to_broadcaster_id) => { return this.API.raid(from_broadcaster_id, to_broadcaster_id) };
    unraid = (broadcaster_id) => { return this.API.unraid(broadcaster_id) };

    getuser = (usernameorid) => { return getuser(this.symbol, usernameorid) };
    getusername = (userid) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers([], userid).then(u => resolve(u.ids[userid])).catch(reject);
        });
    };
    getuserid = (username) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers(username).then(u => resolve(u.logins[username?.toLowerCase()])).catch(reject);
        });
    };

    /** @param {APIgetStreamsFilters} filters */
    getStreams = (filters) => { return this.API.getStreams(filters) };

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