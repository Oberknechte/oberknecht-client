import { i } from "..";

export async function whisper(sym: string, targetUserID: string, message: string, customtoken?: string) {
    return i.OberknechtAPI[sym].whisper(targetUserID, message, customtoken);
};