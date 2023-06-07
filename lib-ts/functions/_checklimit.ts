export function _checklimit(data: object, num: number, time: number) {
    return class {
        static objects = Object.keys(data).filter(v => { return parseInt(v) >= (Date.now() - time) });
        static remainingRaw = (num - this.objects.filter(v => () => { return parseInt(v) >= (Date.now() - time) }).length);
        static remaining = (num - this.remainingRaw < 0 ? 0 : this.remainingRaw);
        static isReached = (this.remaining <= 0)
    };
};