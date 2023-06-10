export type mobjtype = {
    channel: string;
    message: string;
    preContent?: string;
};
export declare function privmsgQueue(sym: string, timeout: number | undefined, mobj: mobjtype, res: Function, rej: Function): void;
