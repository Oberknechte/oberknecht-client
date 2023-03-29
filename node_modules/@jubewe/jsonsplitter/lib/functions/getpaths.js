let i = require("..");
const fs = require("fs");
const path = require("path");
const _mainpath = require("./_mainpath");

/** @param {Symbol} sym */
function getpaths(sym) {
    let paths = {};
    function rd(dirpath) {
        let dir = fs.readdirSync(dirpath, { withFileTypes: true });

        dir.filter(a => a.isFile()).forEach(path_ => {
            paths[path.resolve(dirpath, path_.name)] = path.resolve(dirpath, path_.name).replace(_mainpath(sym), "").replace(/^\/|\/$/g, "");
        });

        dir.filter(a => a.isDirectory()).forEach(dir_ => {
            rd(path.resolve(dirpath, dir_.name));
        });
    };

    rd(i.splitterData[sym]._options.startpath);

    i.splitterData[sym].paths = paths;

    return paths;
};

module.exports = getpaths;