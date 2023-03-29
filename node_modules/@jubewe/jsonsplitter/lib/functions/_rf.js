const fs = require("fs");
const i = require("..");
const _mainpath = require("./_mainpath");
const _wf = require("./_wf");

/** @param {Symbol} sym @param {string} rfpath @param {boolean} parse_json */
function _rf(sym, rfpath, parse_json) {
    if (!rfpath) return new Error(`_rf: rfpath is undefined`);
    let rfpath_ = _mainpath(sym, rfpath);

    try {
        if (fs.existsSync(rfpath_)) {
            let file = fs.readFileSync(rfpath_, "utf-8");
            if (rfpath.endsWith(".json") && parse_json) {
                if (typeof file === "string" && typeof JSON.parse(file) === "object" && Object.keys(file).length > 0) {
                    if(sym) {
                        if(!i.splitterData[sym].actualFiles) i.splitterData[sym].actualFiles = {};
                        i.splitterData[sym].actualFiles[rfpath] = JSON.parse(file);
                        return i.splitterData[sym].actualFiles[rfpath];
                    };
                    return file;
                } else {
                    if (file.length === 0) {
                        _wf(sym, rfpath, {}, true);
                    }
                    return {};
                }
            } else {
                return file;
            }
        } else {
            return new Error(`_rf: File does not exist\nPath: ${rfpath_}`);
        }
    } catch (e) {
        return new Error(`_rf: Could not read file\n${e}`);
    }
};

module.exports = _rf;