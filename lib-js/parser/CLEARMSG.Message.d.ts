export declare class clearmsgMessage {
    sym: any;
    _raw: string;
    timestamp: number;
    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];
    IRCMessagePrefix: string;
    moderatorLogin: string;
    targetUserName: string;
    targetMessageID: string;
    targetMessageText: string;
    channelName: string | undefined;
    channelID: string | undefined;
    serverTimestamp: Date;
    serverTimestampRaw: number;
    serverDelay: number;
    constructor(sym: string, rawMessage: string);
}
