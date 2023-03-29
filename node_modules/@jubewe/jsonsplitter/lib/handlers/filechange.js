let i = require("..");
const _log = require("../functions/_log");
const _wf = require("../functions/_wf");

function filechange(sym) {
    let changed_files = 0;
    if (i.splitterData[sym]._options?.debug >= 2) _log(0, `[JSONSPLITTER] [FILECHANGE] Executed`);
    if (!i.splitterData[sym]?.actualFiles) return;
    Object.keys(i.splitterData[sym].actualMainFiles).forEach(mainfilepath => {
        if ((i.splitterData[sym].actualMainFiles[mainfilepath].hasChanges ?? []).length == 0) return;

        i.splitterData[sym].actualMainFiles[mainfilepath].hasChanges.forEach(filepath => {
            changed_files++;
            i.splitterData[sym].actualMainFiles[mainfilepath].hasChanges.splice(i.splitterData[sym].actualMainFiles[mainfilepath].hasChanges.indexOf(filepath), 1);

            _wf(sym, filepath, i.splitterData[sym].actualFiles[filepath]);
        });

        _wf(sym, mainfilepath, i.splitterData[sym].actualMainFiles[mainfilepath]);
    });

    if (i.splitterData[sym]._options?.debug >= 2) _log(0, `[JSONSPLITTER] [FILECHANGE] Changed ${changed_files} files`);
};

module.exports = filechange;