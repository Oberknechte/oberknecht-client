import { oberknechtAPI } from "oberknecht-api";
import { oberknechtEmitter, oberknechtActionEmitter, oberknechtQueueEmitter } from "oberknecht-emitters";
import { clearchatMessage, globaluserstateMessage, noticeMessage, privmsgMessage, usernoticeMessage, userstateMessage, whisperMessage } from "../parser/Message.Types";

const onPRIVMSGcallback = (privmsg: privmsgMessage, channelName: string, senderUsername: string, messageText: string) => { };
const onGLOBALUSERSTATEcallback = (globaluserstate: globaluserstateMessage) => { };
const onCLEARCHATcallback = (clearchat: clearchatMessage) => { };
const onNOTICEcallback = (notice: noticeMessage) => { };
const onUSERNOTICEcallback = (usernotice: usernoticeMessage) => { };
const onUSERSTATEcallback = (userstate: userstateMessage) => { };
const onWHISPERcallback = (whisper: whisperMessage) => { };
const onErrorcallback = (error: Error) => { };
const onAutojoinCallback = (channels: string[]) => { };
const onEmptyCallback = () => { };

import { clientOptions } from "../types/oberknechtClient.clientOptions";

import { getusers } from "../operations/getusers";
import { _createws } from "../functions/_createws";
import { i } from "..";
import { privmsg } from "../operations/privmsg";
import { ping } from "../operations/ping";
import { whisper } from "../operations/whisper";
import { partAll } from "../operations/partAll";
import { joinAll } from "../operations/joinAll";
import { part } from "../operations/part";
import { join } from "../operations/join";
import { sendraw } from "../operations/sendraw";
import { action } from "../operations/action";

export class oberknechtClient {
    #symbol = String(Symbol());
    #secure: boolean;
    #startTime = Date.now();

    get options() { return i.clientData[this.symbol]?._options ?? {} };
    get clientData() { return i.clientData[this.symbol] };
    get _allIndex() { return i };

    prefix = (this.options.prefix ?? "!");
    API = new oberknechtAPI({ skipCreation: true, token: undefined });
    OberknechtEmitter: oberknechtEmitter = new oberknechtEmitter();
    OberknechtActionEmitter: oberknechtActionEmitter = new oberknechtActionEmitter({ "useExpectedEventNames": true });
    OberknechtQueueEmitter: oberknechtQueueEmitter = new oberknechtQueueEmitter();

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

    static get options(): clientOptions { return this.options };
    static get clientData() { return this.clientData };
    static get _allIndex() { return this._allIndex };

    constructor(options: clientOptions) {
        if (!(options?.token)) throw Error("options.token is undefined");
        let _options = (options ?? {}) as clientOptions;
        _options.max_channels_per_ws = (_options.max_channels_per_ws ?? 100);
        _options.delayBetweenMessages = (_options.delayBetweenMessages ?? 10);
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
        return new Promise<void>(async (resolve, reject) => {
            await this.API.verify()
                .then(() => {
                    i.clientData[this.symbol]._options = {
                        ...i.clientData[this.symbol]._options,
                        clientid: this.API.options.clientid,
                        login: this.API.options.login,
                        userid: this.API.options.userid
                    };
                })
                .catch(reject);

            await _createws(this.symbol);

            return resolve();
        });
    };

    async destroy() {
        return new Promise<void>(async (resolve, reject) => {
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

    privmsg = (channel: string, message: string) => { return privmsg(this.symbol, channel, message) };
    send = this.privmsg;
    say = this.privmsg;
    action = (channel: string, message: string) => { return action(this.symbol, channel, message) };
    sendRaw = (message: string) => { return sendraw(this.symbol, message) };
    join = (channel: string) => { return join(this.symbol, channel) };
    joinAll = (channels: string | string[]) => { return joinAll(this.symbol, channels) };
    part = (channel: string) => { return part(this.symbol, channel) };
    partAll = (channels: string | string[]) => { return partAll(this.symbol, channels) };
    ping = () => { return ping(this.symbol); };
    whisper = (targetUser: string, message: string, customtoken?: string) => { return whisper(this.symbol, targetUser, message, customtoken) };

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

    getuser = async (login: string | undefined, id: string | undefined, noautofilterids: boolean) => { return getusers(this.symbol, login, id, true, noautofilterids) };
    getusers = async (logins: string | string[] | undefined, ids: string | string[] | undefined, noautofilterids: boolean) => { return getusers(this.symbol, logins, ids, null, noautofilterids) };
    getusername = async (userid: string) => {
        return new Promise((resolve, reject) => {
            this.API._getUsers([], userid, true).then(u => resolve(u.ids[userid])).catch(reject);
        });
    };
    getuserid = async (username: string) => {
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

    onPRIVMSG = (callback: typeof onPRIVMSGcallback) => { this.on("PRIVMSG", callback) };
    onGLOBALUSERSTATE = (callback: typeof onGLOBALUSERSTATEcallback) => { this.on("GLOBALUSERSTATE", callback) };
    onCLEARCHAT = (callback: typeof onCLEARCHATcallback) => { this.on("CLEARCHAT", callback) };
    onNOTICE = (callback: typeof onNOTICEcallback) => { this.on("NOTICE", callback) };
    onUSERNOTICE = (callback: typeof onUSERNOTICEcallback) => { this.on("USERNOTICE", callback) };
    onUSERSTATE = (callback: typeof onUSERSTATEcallback) => { this.on("USERSTATE", callback) };
    onWHISPER = (callback: typeof onWHISPERcallback) => { this.on("WHISPER", callback) };
    onError = (callback: typeof onErrorcallback) => { this.on("error", callback) };
    onReady = (callback: typeof onEmptyCallback) => { this.on("ready", callback) };
    onClose = (callback: typeof onEmptyCallback) => { this.on("irc:close", callback) };
    onAutojoin = (callback: typeof onAutojoinCallback) => { this.on("autojoin", callback) };
};