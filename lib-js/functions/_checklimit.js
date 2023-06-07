"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checklimit = void 0;
function _checklimit(data, num, time) {
    return class {
        static objects = Object.keys(data).filter(v => { return parseInt(v) >= (Date.now() - time); });
        static remainingRaw = (num - this.objects.filter(v => () => { return parseInt(v) >= (Date.now() - time); }).length);
        static remaining = (num - this.remainingRaw < 0 ? 0 : this.remainingRaw);
        static isReached = (this.remaining <= 0);
    };
}
exports._checklimit = _checklimit;
;
