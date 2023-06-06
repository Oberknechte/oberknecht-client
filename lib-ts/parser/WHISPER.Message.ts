import { BadgesMap, correctMessage, messageBadges, messageCommand, messageContent, messageEmotes, messageEmotesReturn, messageParameters, messagePrefix, messageUser } from "oberknecht-utils";
import { whisper } from "../operations/whisper";
import { sendraw } from "../operations/sendraw";
import { userstate } from "./subclasses/WHISPER.userstate";
import { message } from "./subclasses/WHISPER.message";
import { channel } from "./subclasses/WHISPER.channel";
import { server } from "./subclasses/WHISPER.server";
import { i } from "..";

export class whisperMessage {
    sym;
    _raw: string;
    timestamp: number;

    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];
    IRCMessagePrefix: string;

    prefix: string;
    command: string | undefined;

    badges: BadgesMap;
    badgesRaw: string;

    messageText: string;
    messageParts: string[];
    messageArguments: string[];

    senderUserName: string;
    senderDisplayName: string;
    senderUserID: string;
    senderUserType: string;
    senderUserColor: string;

    emotes: messageEmotesReturn;
    emotesRaw: string;

    turbo: boolean;
    turboRaw: string;

    threadID: string;
    messageID: string;

    userstate: userstate;
    message: message;
    channel: channel;
    server: server;

    constructor(sym: string, rawMessage: string) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;

        this.IRCCommand = messageCommand(this._raw);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCParameters = messageParameters(this._raw);
        this.IRCMessagePrefix = messagePrefix(this._raw);

        this.prefix = i.clientData[sym]._options.prefix;

        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = messageUser(this.IRCMessagePrefix);
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];

        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = messageEmotes(this.emotesRaw);

        this.messageText = this.IRCMessageParts[4];
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];

        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command = ((msgmatch ?? undefined) ? msgmatch?.[0]?.replace(new RegExp(`^${this.prefix}`), "") : undefined)
        if (msgmatch) this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);

        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = (this.turboRaw === "1");

        this.threadID = this.IRCParameters["thread-id"];
        this.messageID = this.IRCParameters["message-id"];

        this.userstate = new userstate(this);
        this.message = new message(this);
        this.channel = new channel(this);
        this.server = new server(this);
    };

    async whisper(message: string) { return whisper(this.sym, this.senderUserID, message) };
    send = this.whisper;
    reply = this.whisper;
    action = this.whisper;

    async sendRaw(message: string) { return sendraw(this.sym, message).catch() };
};