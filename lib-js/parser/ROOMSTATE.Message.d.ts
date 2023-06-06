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
    constructor(sym: string, rawMessage: string);
}
