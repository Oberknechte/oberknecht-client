import { BadgesMap, messageEmotesReturn } from "oberknecht-utils";
import { userstate } from "./subclasses/WHISPER.userstate";
import { message } from "./subclasses/WHISPER.message";
import { channel } from "./subclasses/WHISPER.channel";
import { server } from "./subclasses/WHISPER.server";
export declare class whisperMessage {
    sym: any;
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
    constructor(sym: string, rawMessage: string);
    whisper(message: string): Promise<any>;
    send: (message: string) => Promise<any>;
    reply: (message: string) => Promise<any>;
    action: (message: string) => Promise<any>;
    sendRaw(message: string): Promise<unknown>;
}
