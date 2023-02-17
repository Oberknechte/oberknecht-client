const i = require("..");

function privmsgQueue(sym, timeout) {
    setTimeout(triggerQueue, (timeout ?? 30000));
    
    function triggerQueue(){
        if((i.clientData[sym].queue?.privmsg ?? []).length > 0){
            const messageNum = ((i.clientData[sym]._options?.isAlwaysMod ?? false) ? 100 : 20);

            let channelMessages = {};
            i.clientData[sym].queue.privmsg.map(a => {
                if(!channelMessages[a.channel]) channelMessages[a.channel] = [];
                if(channelMessages[a.channel].length < messageNum){
                    channelMessages[a.channel].push(a);
                };
            });

            Object.keys(channelMessages).forEach(channel => {
                if(!i.clientData[sym].queueData.privmsg) i.clientData[sym].queueData.privmsg = {};
                if(!i.clientData[sym].queueData.privmsg[channel]) i.clientData[sym].queueData.privmsg[channel] = {};
                if(!i.clientData[sym].queueData.privmsg._all) i.clientData[sym].queueData.privmsg._all = {};

                Object.keys(channelMessages[channel]).forEach(message => {
                    i.clientData[sym].queueData.privmsg[channel][Date.now()] = message;
                    i.clientData[sym].queueData.privmsg._all[Date.now()] = message;
    
                    i.emitTwitchAction(sym, "PRIVMSG", `${message.channel} :${message.message}`, (message.preContent ?? undefined))
                    .then(() => {
                        i.OberknechtQueueEmitter[sym].emitResolve("PRIVMSG", message);
                    })
                    .catch(e => {
                        i.OberknechtQueueEmitter[sym].emitReject("PRIVMSG", message, e);
                    });
                });
            });
        };
    };
};

module.exports = privmsgQueue;