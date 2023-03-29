let i = require("..");
const getmainpaths = require("./getmainpaths");
const _rf = require("./_rf");

/** @param {Symbol} sym */
function getmainfiles(sym) {
    let mainPaths = getmainpaths(sym);

    let mainFiles = {};

    Object.keys(mainPaths).forEach(dir => {
        mainFiles[dir] = () => {
            if (!i.splitterData[sym]?.actualMainFiles?.[dir]) {
                let file = _rf(sym, dir, true);
                i.splitterData[sym].actualMainFiles[dir] = file;
                return file;
            };

            return i.splitterData[sym].actualMainFiles[dir];
        };
    });

    i.splitterData[sym].mainFiles = mainFiles;

    return mainFiles;
};

module.exports = getmainfiles;