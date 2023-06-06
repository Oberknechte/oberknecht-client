export declare class twitchAction {
    static join: (sym: string, channel: string, wsnum?: number) => Promise<unknown>;
    static privmsg: (sym: string, channel: string, message: string, preContent?: string) => Promise<unknown>;
}
