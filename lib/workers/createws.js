const reconnectingKnecht = require("reconnecting-websocket");
const messageParser = require("../parser/messageParser");
const knechtSocket = require("ws").WebSocket;
const _log = require("./_log");

let { workerData, parentPort } = require("worker_threads")

let sym = workerData.sym;

_log(sym, 1, 3, `Creating new WebSocket`);
let i = require("..");
if (!i.clientData[sym]) return;

let oberknechtEmitter = i.OberknechtEmitter[sym];
if (!i.reconnectingKnechtClient[sym]) i.reconnectingKnechtClient[sym] = {};
if (!i.clientData[sym].knechtSockets) i.clientData[sym].knechtSockets = {};
if (!i.clientData[sym].knechtSockets.channels) i.clientData[sym].knechtSockets.channels = {};

let wsNum = (i.clientData[sym].wsNum ?? 0).toString();
i.clientData[sym].wsNum++;

let reconnectingKnechtSocket = new reconnectingKnecht(i.clientData[sym].wsUrl, [], { WebSocket: knechtSocket })
i.reconnectingKnechtClient[sym][wsNum] = reconnectingKnechtSocket;
i.clientData[sym].knechtSockets[wsNum] = {
    "channels": []
};

i.clientData[sym].currentKnecht = wsNum;

reconnectingKnechtSocket.addEventListener("open", (response) => {
    _log(sym, 1, 3, `New WebSocket Created`);
    if (!i.clientData[sym]) return;
    i.clientData[sym].knechtSockets[wsNum].startTime = Date.now();
    reconnectingKnechtSocket.send(`CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`);
    reconnectingKnechtSocket.send(`PASS ${!i.clientData[sym]._options.anonymus ? `oauth:${i.clientData[sym]._options.token ?? ""}` : "schmoopiie"}`);
    reconnectingKnechtSocket.send(`NICK ${!i.clientData[sym]._options.anonymus ? i.clientData[sym]._options.username ?? "oberknecht" : "justinfan69"}`);
    oberknechtEmitter.emit(["ws:open", `ws:${wsNum}:open`, "client:open", "irc:open", "open"], response);

    i.clientData[sym].wsConnections.push(wsNum);

    if (i.clientData[sym].knechtSockets[wsNum].closechannels) {
        i.clientData[sym].knechtSockets[wsNum].closechannels.forEach(ch => {
            i.emitTwitchAction(sym, wsNum, "JOIN", ch)
                .then(() => {
                    if (i.clientData[sym].knechtSockets[wsNum].closechannels.includes(ch)) i.clientData[sym].knechtSockets[wsNum].closechannels.splice(i.clientData[sym].knechtSockets[wsNum].closechannels.indexOf(ch), 1);
                });
        });
    };

    parentPort.postMessage(wsNum);
});

reconnectingKnechtSocket.addEventListener("close", (response) => {
    if (!i.clientData[sym]) return;
    i.clientData[sym].knechtSockets[wsNum].closechannels = i.clientData[sym].knechtSockets[wsNum].channels;
    i.clientData[sym].knechtSockets[wsNum].channels.forEach(ch => {
        if (i.clientData[sym].channels.includes(ch)) i.clientData[sym].channels.splice(i.clientData[sym].channels.indexOf(ch), 1);
    });
    i.clientData[sym].knechtSockets[wsNum].channels = [];
    i.clientData[sym].knechtSockets[wsNum].startTime = null;
    i.clientData[sym].wsConnections.splice(i.clientData[sym].wsConnections.indexOf(wsNum), 1);

    let response_ = response.data;
    oberknechtEmitter.emit(["ws:close", `ws:${wsNum}:close`, "client:close", "irc:close", "close"], response_);
});

reconnectingKnechtSocket.addEventListener("message", (response) => {
    if (!i.clientData[sym]) return;
    oberknechtEmitter.emit(["ws:message", `ws:${wsNum}:message`], response);
    response.data.replace(/\r\n$/g, "").split("\r\n").forEach(response_ => {
        messageParser(sym, response_, wsNum);
    });
});

reconnectingKnechtSocket.addEventListener("error", (response) => {
    if (!i.clientData[sym]) return;
    oberknechtEmitter.emitError(["ws:error", "client:error", `ws:${wsNum}:error`], Error(response));
});