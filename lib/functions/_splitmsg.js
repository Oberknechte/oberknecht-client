/** @param {string} msg @param {number} num @param {string} splitter @param {number} maxsplitdistance */
function _splitmsg(msg, num, splitter, maxsplitdistance) {
    if (!(msg ?? undefined)) return;
    if (!(num ?? undefined)) num = 500; if (!(splitter ?? undefined)) splitter = " "; if (!(maxsplitdistance ?? undefined)) maxsplitdistance = 20;
    if (msg.length <= num) return [msg];
    let m = msg.split("");
    let r = [];
    for (let i = 0; i < Infinity; i++) {
        if (m.length == 0) i = Infinity;

        let p = m.splice(0, 500).join("");
        let ls = p.lastIndexOf(splitter);
        if (ls !== -1) {
            if (ls >= (splitter - maxsplitdistance)) {
                p = p.substring(0, ls);
                let pa = p.substring(ls);
                msg = pa + (!pa.endsWith(splitter) ? splitter : "") + msg;
            };
        };
        
        r.push(p);
    };

    return r;
};

module.exports = _splitmsg;