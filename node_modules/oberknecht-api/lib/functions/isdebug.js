const i = require("..");

function isdebug(sym, num){
    return (i.apiclientData[sym]?._options?.debug >= (num ?? 1))
};

module.exports = isdebug;