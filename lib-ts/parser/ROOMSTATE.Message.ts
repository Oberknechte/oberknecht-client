import { messageCommand, messageContent, messageParameters } from "oberknecht-utils";
import { i } from "..";

export class roomstateMessage {
    sym;
    _raw: string;
    timestamp: number;

    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];

    channelID: string;
    channelName: string;

    isEmoteOnly: boolean;
    emoteOnlyRaw: boolean;

    isFollowersOnly: boolean;
    followersOnlyRaw: boolean;

    isR9k: boolean;
    r9kRaw: boolean;

    isSubsOnly: boolean;
    subsOnlyRaw: boolean;

    isSlow: boolean;
    slow: number;
    slowRaw: string;

    serverTimestamp: Date;
    serverTimestampRaw: number;

    serverDelay: number;

    constructor(sym: string, rawMessage: string) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCParameters = messageParameters(this._raw);

        this.channelID = this.IRCParameters["room-id"];
        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]);

        this.emoteOnlyRaw = this.IRCParameters["emote-only"];
        // @ts-ignore
        this.isEmoteOnly = (this.emoteOnlyRaw === "1");

        this.followersOnlyRaw = this.IRCParameters["followers-only"];
        // @ts-ignore
        this.isFollowersOnly = (this.followersOnlyRaw === "1");

        this.r9kRaw = this.IRCParameters["r9k"];
        // @ts-ignore
        this.isR9k = (this.r9kRaw === "1");

        this.subsOnlyRaw = this.IRCParameters["subs-only"];
        // @ts-ignore
        this.isSubsOnly = (this.subsOnlyRaw === "1");

        this.slowRaw = this.IRCParameters["slow"];
        this.slow = parseInt(this.slowRaw);
        this.isSlow = (this.slow > 0);

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
        this.serverDelay = (dn - this.serverTimestampRaw);
    };
};