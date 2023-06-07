export declare class roomstateMessage {
    sym: any;
    _raw: string;
    timestamp: number;
    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];
    channelID: string;
    channelName: string;
    isEmoteOnly: boolean;
    emoteOnlyRaw: string;
    isFollowersOnly: boolean;
    followersOnlyRaw: string;
    isR9k: boolean;
    r9kRaw: string;
    isSubsOnly: boolean;
    subsOnlyRaw: string;
    isSlow: boolean;
    slow: number;
    slowRaw: string;
    serverTimestamp: Date;
    serverTimestampRaw: number;
    serverDelay: number;
    constructor(sym: string, rawMessage: string);
}
