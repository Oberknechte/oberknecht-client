import { usernoticeMessage } from "../USERNOTICE.Message";
export declare class server {
    _inp: usernoticeMessage;
    timestamp: Date;
    timestampRaw: number;
    IRCParameters: object;
    constructor(inp: usernoticeMessage);
}
