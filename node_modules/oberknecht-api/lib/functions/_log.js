function date_() { return new Date(new Date().setMinutes(new Date().getMinutes() - new Date().getTimezoneOffset())).toISOString().split("Z")[0].replace("T", " ") };

/** @param {number?} logopt 0 = log, 1 = info, 2 = error @param {string | Error?} logmsg @param {string?} logcolorfg @param {string?} logcolorbg */
function _log(logopt, logmsg, logcolorfg, logcolorbg) {
    if (!global.logs) global.logs = {};
    if (!global.logs[logopt]) global.logs[logopt] = {};
    if (!global.logs.all) global.logs.all = {};
    if(typeof logmsg === "string") {
        global.logs.all[Date.now()] = global.logs[logopt][Date.now()] = [logopt, logmsg?.replace(/\x1b\[[\w;]+m/g, ""), date_()];
    };

    const logcolors = { "reset": "0", "bright": "1", "dim": "2", "underscore": "4", "blink": "5", "reverse": "7", "hidden": "8", "fgblack": "30", "fgred": "31", "fggreen": "32", "fgyellow": "33", "fgblue": "34", "fgmagenta": "35", "fgcyan": "36", "fgwhite": "37", "bgblack": "40", "bgred": "41", "bggreen": "42", "bgyellow": "43", "bgblue": "44", "bgmagenta": "45", "bgcyan": "46", "bgwhite": "47" };
    const casecolors = { "fg": { "0": "", "1": "30", "2": "41" }, "bg": { "0": "", "1": "43", "2": "41" } };
    logcolorfg = (`\x1b[${(((logcolorfg ?? 0) == 0 ? (casecolors.fg[(logopt ?? 0)]) : (logcolors[logcolorfg] ? logcolors[logcolorfg] : logcolorfg ?? casecolors.fg[(logopt ?? 0)])))}m`);
    logcolorbg = (`\x1b[${(((logcolorbg ?? 0) == 0 ? (casecolors.bg[(logopt ?? 0)]) : (logcolors[logcolorbg] ? logcolors[logcolorbg] : logcolorbg ?? casecolors[(logopt ?? 0)])))}m`);
    const logm = [`${logcolorbg}${logcolorfg} ${date_()} \x1b[0m >`, (logmsg.error?.message ?? logmsg.error ?? logmsg?.message ?? logmsg)];
    switch (logopt) { default: case 0: return console.log(...logm); case 1: return console.info(...logm); case 2: return console.error(...logm); };
};

module.exports = _log;