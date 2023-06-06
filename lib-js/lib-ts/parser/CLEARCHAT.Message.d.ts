export declare class clearchatMessage {
    sym: any;
    _raw: string;
    timestamp: number;
    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];
    banDuration: number | undefined;
    channelName: string;
    channelID: string;
    targetUserID: string | undefined;
    targetUserName: string | undefined;
    serverTimestamp: Date;
    serverTimestampRaw: number;
    serverDelay: number;
    constructor(sym: string, rawMessage: string);
}
