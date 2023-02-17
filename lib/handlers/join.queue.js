const i = require("..");

function joinQueue(sym, timeout) {
    setTimeout(triggerQueue, (timeout ?? 10000));
    
    function triggerQueue(){
        if((i.clientData[sym].queue?.join ?? []).length > 0){
            const channelNum = ((i.clientData[sym]._options?.botStatus ?? "default") === "verified" ? 2000 : 20);
            const channels = i.clientData[sym].queue.join.splice(0, channelNum);
            channels.forEach(channel => {
                if(!i.clientData[sym].queueData.join) i.clientData[sym].queueData.join = {};

                i.clientData[sym].queueData.join[Date.now()] = channel;

                if(!i.clientData[sym].channels) i.clientData[sym].channels = [];
                if(!i.clientData[sym].channels.includes(channel)) i.clientData[sym].channels.push(channel);

                i.emitTwitchAction(sym, "JOIN", channel)
                .then(() => {
                    i.OberknechtQueueEmitter[sym].emitResolve("JOIN", channel);
                })
                .catch(e => {
                    i.OberknechtQueueEmitter[sym].emitReject("JOIN", channel, e);
                });
            });
        };
    };
};

module.exports = joinQueue;