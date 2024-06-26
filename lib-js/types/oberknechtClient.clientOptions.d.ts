import { oberknechtAPI } from "oberknecht-api";
import { oberknechtAPIOptionsType } from "oberknecht-api/lib-ts/types/oberknechtAPIOptions";
import { oberknechtEmitterOptions } from "oberknecht-emitters/lib-ts/types/oberknecht.emitter.options";
export declare type clientOptions = {
    token: string;
    username?: string;
    channels?: string[];
    prefix?: string;
    clientid?: string | undefined;
    secure?: boolean;
    anonymus?: boolean;
    botStatus?: "verified" | "none";
    isAlwaysMod?: boolean;
    oberknechtApi?: oberknechtAPI;
    reconnectMultiplier?: number;
    executeOnOutgoingPrivmsg?: Function;
    max_channels_per_ws?: number;
    debug?: number;
    apiOptions?: oberknechtAPIOptionsType;
    ignoreJoinLimits?: boolean;
    disableSlashCommands?: boolean;
    delayBetweenMessages?: number;
    asyncDelay?: number;
    emitterOptions?: oberknechtEmitterOptions;
    maxPendingWSPings?: number;
    wsPingInterval?: number;
};
