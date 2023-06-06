"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._createws = void 0;
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const messageParser_1 = require("../parser/messageParser");
const ws_1 = require("ws");
const __1 = require("..");
async function _createws(sym) {
    return new Promise((resolve, reject) => {
        if (!__1.i.clientData[sym])
            return;
        let oberknechtEmitter = __1.i.OberknechtEmitter[sym];
        if (!__1.i.reconnectingKnechtClient[sym])
            __1.i.reconnectingKnechtClient[sym] = {};
        if (!__1.i.clientData[sym].knechtSockets)
            __1.i.clientData[sym].knechtSockets = {};
        if (!__1.i.clientData[sym].knechtSockets.channels)
            __1.i.clientData[sym].knechtSockets.channels = {};
        let wsNum = (__1.i.clientData[sym].wsNum ?? 0).toString();
        __1.i.clientData[sym].wsNum++;
        let reconnectingKnechtSocket = new reconnecting_websocket_1.default(__1.i.clientData[sym].wsUrl, [], { WebSocket: ws_1.WebSocket });
        __1.i.reconnectingKnechtClient[sym][wsNum] = reconnectingKnechtSocket;
        __1.i.clientData[sym].knechtSockets[wsNum] = {
            "channels": []
        };
        __1.i.clientData[sym].currentKnecht = wsNum;
        reconnectingKnechtSocket.addEventListener("open", (response) => {
            if (!__1.i.clientData[sym])
                return;
            __1.i.clientData[sym].knechtSockets[wsNum].startTime = Date.now();
            reconnectingKnechtSocket.send(`CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`);
            reconnectingKnechtSocket.send(`PASS ${!__1.i.clientData[sym]._options.anonymus ? `oauth:${__1.i.clientData[sym]._options.token ?? ""}` : "schmoopiie"}`);
            reconnectingKnechtSocket.send(`NICK ${!__1.i.clientData[sym]._options.anonymus ? __1.i.clientData[sym]._options.username ?? "oberknecht" : "justinfan69"}`);
            oberknechtEmitter.emit(["ws:open", `ws:${wsNum}:open`, "client:open", "irc:open", "open"], response);
            __1.i.clientData[sym].wsConnections.push(wsNum);
            if (__1.i.clientData[sym].knechtSockets[wsNum].closechannels) {
                __1.i.clientData[sym].knechtSockets[wsNum].closechannels.forEach(ch => {
                    __1.i.emitTwitchAction(sym, wsNum, "JOIN", ch)
                        .then(() => {
                        if (__1.i.clientData[sym].knechtSockets[wsNum].closechannels.includes(ch))
                            __1.i.clientData[sym].knechtSockets[wsNum].closechannels.splice(__1.i.clientData[sym].knechtSockets[wsNum].closechannels.indexOf(ch), 1);
                    });
                });
            }
            ;
            resolve(wsNum);
        });
        reconnectingKnechtSocket.addEventListener("close", (response) => {
            if (!__1.i.clientData[sym])
                return;
            __1.i.clientData[sym].knechtSockets[wsNum].closechannels = __1.i.clientData[sym].knechtSockets[wsNum].channels;
            __1.i.clientData[sym].knechtSockets[wsNum].channels.forEach(ch => {
                if (__1.i.clientData[sym].channels.includes(ch))
                    __1.i.clientData[sym].channels.splice(__1.i.clientData[sym].channels.indexOf(ch), 1);
            });
            __1.i.clientData[sym].knechtSockets[wsNum].channels = [];
            __1.i.clientData[sym].knechtSockets[wsNum].startTime = null;
            __1.i.clientData[sym].wsConnections.splice(__1.i.clientData[sym].wsConnections.indexOf(wsNum), 1);
            oberknechtEmitter.emit(["ws:close", `ws:${wsNum}:close`, "client:close", "irc:close", "close"], response);
        });
        reconnectingKnechtSocket.addEventListener("message", (response) => {
            if (!__1.i.clientData[sym])
                return;
            oberknechtEmitter.emit(["ws:message", `ws:${wsNum}:message`], response);
            response.data.replace(/\r\n$/g, "").split("\r\n").forEach(response_ => {
                (0, messageParser_1.messageParser)(sym, response_, wsNum);
            });
        });
        reconnectingKnechtSocket.addEventListener("error", (response) => {
            if (!__1.i.clientData[sym])
                return;
            oberknechtEmitter.emitError(["ws:error", "client:error", `ws:${wsNum}:error`], response);
        });
    });
}
exports._createws = _createws;
;
