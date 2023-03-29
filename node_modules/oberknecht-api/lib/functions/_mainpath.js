const path = require("path");
const i = require("..");

/** @param {string} path_  */
function _mainpath(sym, path_) {
    let startPath = (i.apiclientData?.[sym]?._options?.startPath ?? path.resolve(path.dirname(__dirname), "../"));

    if (!path_ || (path_?.length ?? 0) === 0) {
        return path.resolve(startPath, "./");
    } else {
        if (Array.isArray(path_)) path_ = path.resolve(...path_);
        if (!path_.startsWith(startPath)) path_ = path.resolve(startPath, path_);
        return path_;
    };
};

module.exports = _mainpath;