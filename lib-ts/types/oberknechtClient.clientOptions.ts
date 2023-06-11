import { oberknechtAPI } from "oberknecht-api";
import { oberknechtAPIOptions } from "oberknecht-api/lib-ts/types/oberknechtAPIOptions";

export type clientOptions = {
  token: string;
  // Token link generator: https://jubewe.github.io/oauthlink
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
  apiOptions?: typeof oberknechtAPIOptions;
  ignoreJoinLimits?: boolean;
  disableSlashCommands?: boolean;
  delayBetweenMessages?: number;
  asyncDelay?: number;
};
