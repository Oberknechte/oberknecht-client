/** @param {Object} data @param {number} num @param {number} time */
function _checklimit(data, num, time) {
    return class {
        static objects = Object.keys(data).filter(v => {return parseInt(v) >= (Date.now() - time)});
        static remainingRaw = (num - this.objects.filter(v => () => { return parseInt(v) >= (Date.now() - time) }).length);
        static remaining = (num - this.remainingRaw < 0 ? 0 : this.remainingRaw);
        static isReached = (this.remaining === 0)
    };
};

module.exports = _checklimit;