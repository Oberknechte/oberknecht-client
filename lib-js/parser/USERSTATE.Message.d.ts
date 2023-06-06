export declare class userstateMessage {
    sym: any;
    _raw: string;
    timestamp: number;
    IRCCommand: string;
    IRCParameters: object;
    IRCMessageParts: string[];
    IRCMessagePrefix: string;
    badgeInfo: string;
    badges: object;
    badgesRaw: string;
    senderUserName: string | undefined;
    senderDisplayName: string | undefined;
    senderUserType: string | undefined;
    senderUserColor: string | undefined;
    channelNameRaw: string | undefined;
    channelName: string | undefined;
    emoteSets: string[];
    emoteSetsRaw: string;
    isMod: boolean;
    isModRaw: string;
    isSubscriber: boolean;
    isSubscriberRaw: string;
    turbo: boolean;
    turboRaw: string;
    messageID: string | undefined;
    constructor(sym: string, rawMessage: string);
}
