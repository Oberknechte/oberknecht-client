import { i } from "..";

export async function ping(sym: string, wsnum?: number) {
  return new Promise((resolve, reject) => {
    let pingstart = Date.now();

    i.emitTwitchAction(sym, wsnum, "PING")
      .then(() => {
        return resolve(Date.now() - pingstart);
      })
      .catch(reject);
  });
}
