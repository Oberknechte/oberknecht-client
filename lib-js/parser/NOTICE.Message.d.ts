export declare class noticeMessage {
    sym: any;
    timestamp: number;
    _raw: string;
    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];
    msgID: string;
    messageText: string;
    targetUserID: string | undefined;
    channelName: string;
    serverTimestamp: Date;
    serverTimestampRaw: number;
    serverDelay: number;
    constructor(sym: string, rawMessage: string);
}
