import { correctChannelName } from "oberknecht-utils";
import { twitchAction } from "../handlers/twitchAction";

export async function join(sym: string, channel: string) {
  if (!(channel ?? undefined)) return;

  let channel_ = correctChannelName(channel);

  return await twitchAction.join(sym, channel_);
}
