import { privmsgMessage } from "../PRIVMSG.Message";
export declare class server {
    _inp: privmsgMessage;
    timestamp: Date;
    timestampRaw: number;
    IRCParameters: object;
    constructor(inp: privmsgMessage);
}
