import { i } from "..";

export async function pong(sym: string, wsnum?: number) {
    return i.emitTwitchAction(sym, wsnum, "PONG");
};