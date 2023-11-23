"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._log = void 0;
const __1 = require("..");
function date_() {
    return new Date(new Date().setMinutes(new Date().getMinutes() - new Date().getTimezoneOffset()))
        .toISOString()
        .split("Z")[0]
        .replace("T", " ");
}
function _log(sym, logopt, debugnum, logmsg, logcolorfg, logcolorbg) {
    const logcolors = {
        reset: "0",
        bright: "1",
        dim: "2",
        underscore: "4",
        blink: "5",
        reverse: "7",
        hidden: "8",
        fgblack: "30",
        fgred: "31",
        fggreen: "32",
        fgyellow: "33",
        fgblue: "34",
        fgmagenta: "35",
        fgcyan: "36",
        fgwhite: "37",
        bgblack: "40",
        bgred: "41",
        bggreen: "42",
        bgyellow: "43",
        bgblue: "44",
        bgmagenta: "45",
        bgcyan: "46",
        bgwhite: "47",
    };
    const casecolors = {
        fg: { "0": "", "1": "30", "2": "41" },
        bg: { "0": "", "1": "43", "2": "41" },
    };
    // @ts-ignore
    logcolorfg = `\x1b[${(logcolorfg ?? 0) == 0
        ? casecolors.fg[logopt ?? 0]
        : logcolors[logcolorfg]
            ? logcolors[logcolorfg]
            : logcolorfg ?? casecolors.fg[logopt ?? 0]}m`;
    // @ts-ignore
    logcolorbg = `\x1b[${(logcolorbg ?? 0) == 0
        ? casecolors.bg[logopt ?? 0]
        : logcolors[logcolorbg]
            ? logcolors[logcolorbg]
            : logcolorbg ?? casecolors[logopt ?? 0]}m`;
    const logm = [
        `${logcolorbg}${logcolorfg} ${date_()} \x1b[0m >`,
        // @ts-ignore
        logmsg?.error?.message ?? logmsg.error ?? logmsg?.message ?? logmsg,
    ];
    if (__1.i.clientData[sym]?._options?.debug >= debugnum)
        switch (logopt) {
            default:
            case 0:
                return console.log(...logm);
            case 1:
                return console.info(...logm);
            case 2:
                return console.error(...logm);
        }
}
exports._log = _log;
