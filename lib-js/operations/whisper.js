"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whisper = void 0;
let __1 = require("..");
async function whisper(sym, targetUserID, message, customtoken) {
    return __1.i.OberknechtAPI[sym].whisper(targetUserID, message, customtoken);
}
exports.whisper = whisper;
