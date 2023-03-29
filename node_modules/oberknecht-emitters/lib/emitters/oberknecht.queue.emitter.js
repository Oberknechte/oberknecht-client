class oberknechtQueueEmitter {
    events = {};

    constructor() {
        this.events = {};
    };

    once = (eventName, arg) => {
        return new Promise((resolve, reject) => {
            if(!this.events[eventName]) this.events[eventName] = {};

            const sym = `ch_${this.num}`;

            this.events[eventName][sym] = {
                arg: arg ?? null,
                resolve: (args) => {
                    delete this.events[eventName][sym];
                    resolve(args);
                },
                reject: (args) => {
                    delete this.events[eventName][sym];
                    reject(args);
                },
            };
        });
    };

    emitResolve = (eventName, arg) => {
        const o = this.events[eventName];
        o[Object.keys(o).filter(a => (!(arg ?? undefined) || (o[a].arg && o[a].arg == arg)))[0]]?.resolve();
    };
    
    emitReject = async (eventName, arg, e) => {
        let o = this.events[eventName];
        o[Object.keys(o).filter(a => (!(arg ?? undefined) || (o[a].arg && o[a].arg == arg)))[0]]?.reject(e);
    };
};

module.exports = oberknechtQueueEmitter;