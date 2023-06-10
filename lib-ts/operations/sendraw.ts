import { i } from "..";

export async function sendraw(sym: string, msg: string, wsnum?: number) {
  return new Promise((resolve, reject) => {
    if (!(msg ?? undefined)) return reject(Error("msg is undefined"));

    return i.emitTwitchAction(sym, wsnum, "RAW", "", "", msg);
  });
}
