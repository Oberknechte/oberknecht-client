const _log = require("../functions/_log");
const _stackname = require("../functions/_stackname");
const _wf = require("../functions/_wf");
const _getallobjectkeystree = require("../functions/_getallobjectkeystree");
const _getbyobjectkeyfromtree = require("../functions/_getbyobjectkeyfromtree");
const isdebug = require("../functions/isdebug");
const i = require("..");

function filechange(sym) {
    if (isdebug(sym, 2)) {
        _log(0, `${_stackname("oberknecht-api", "handlers", "filechange")[3]} executed`);
    };

    let changed_files = 0;

    let files = i.apiclientData[sym].files;

    async function filechange() {
        for (let file in files) {
            if (files[file].hasChanges && _getallobjectkeystree(i.apiclientData[sym].paths).includes(file)) {
                delete files[file].hasChanges;
                // console.log("filechange", files[file]);
                _wf(sym, _getbyobjectkeyfromtree(i.apiclientData[sym].paths, file)[0][0], files[file], true);
                changed_files++;
            };
        };
    };

    filechange();

    if (isdebug(sym, 2)) {
        _log(0, `${_stackname("oberknecht-api", "handlers", "filechange")[3]} executed\t(Changed ${changed_files})`);
    };
};

module.exports = filechange;