/** @param {string} msg @param {number} num @param {string} splitter @param {number} maxsplitdistance */
function _splitmsg(msg, num, splitter, maxsplitdistance, insertbetweensplits) {
    if (!(msg ?? undefined)) return;
    if (!(num ?? undefined)) num = 500; if (!(splitter ?? undefined)) splitter = " "; if (!(maxsplitdistance ?? undefined)) maxsplitdistance = 50; if (!(insertbetweensplits ?? undefined)) insertbetweensplits = "";
    if (msg.length <= num) return [msg];
    let m = msg.split("");
    let r = [];
    for (let i = 0; i < Infinity; i++) {
        if (m.length <= 0) break;
        let p = ((i > 0 && m.length > 0) ? insertbetweensplits : "") + m.splice(0, num)?.join("");
        let ls = p.lastIndexOf(splitter);
        if (ls !== -1 && p.length == num) {
            if (ls >= (num - maxsplitdistance)) {
                let p_ = p;
                p = p_.substring(0, ls);
                let pa = p_.substring(ls + 1);
                m.unshift(...pa);
            };
        };

        if (p.length > 0) r.push(p); else break;
    };
    return r;
};

module.exports = _splitmsg;