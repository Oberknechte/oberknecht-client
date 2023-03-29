let i = require("..");
const fs = require("fs");
const path = require("path");
const _mainpath = require("./_mainpath");

/** @param {Symbol} sym */
function getmainpaths(sym) {
    let mainPaths = {};
    function rd(dirpath) {
        let dir = fs.readdirSync(dirpath, { withFileTypes: true });

        let mains = dir.filter(a => a.name == "_main.json");
        if(mains.length > 0) mainPaths[path.resolve(dirpath, mains[0].name)] = path.resolve(dirpath, mains[0].name).replace(_mainpath(sym), "").replace(/^\/|\/$/g, "");
        dir.filter(a => a.isDirectory()).forEach(dir_ => {
            rd(path.resolve(dirpath, dir_.name));
        });
    };

    rd(i.splitterData[sym]._options.startpath);

    i.splitterData[sym].mainPaths = mainPaths;

    return mainPaths;
};

module.exports = getmainpaths;