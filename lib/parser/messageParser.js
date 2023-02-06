const messageCommand = require("./util/messageCommand");
const joinAll = require("../operations/joinAll");
const messageTypes = require("./Message.Types");

/**
 * @param {string} rawMessage 
 */
function messageParser(sym, rawMessage){
    if(!(rawMessage ?? undefined)) throw new Error();
    rawMessage = rawMessage.replace(/\r\n$/g, "");
    
    let i = require("../index");

    let ircCommand = messageCommand(rawMessage);
    
    i.OberknechtEmitter[sym].emit(["irc:_message"], rawMessage);
    i.OberknechtActionEmitter[sym].emit(ircCommand, rawMessage);

    switch (ircCommand){
        case "CLEARCHAT":
        case "CLEARMSG":
        case "GLOBALUSERSTATE": 
        case "NOTICE": 
        case "PRIVMSG": 
        case "ROOMSTATE": 
        case "USERNOTICE": 
        case "USERSTATE": 
        case "WHISPER": {
            i.OberknechtEmitter[sym].emit([`irc:${ircCommand.toLowerCase()}`, ircCommand], new messageTypes[`${ircCommand.toLowerCase()}Message`](sym, rawMessage));
            break;
        }

        case "PING": {
            i.OberknechtEmitter[sym].emit(["irc:ping","PING"]);
            i.reconnectingKnechtClient[sym].send("PONG");
            break;
        };

        case "PONG": {
            i.OberknechtEmitter[sym].emit(["irc:pong","PONG"]);
            break;
        }
        
        case "375": {
            i.OberknechtEmitter[sym].emit(["client:ready","irc:open","irc:ready","ready"], rawMessage);
            
            if(i.clientData[sym]._options.channels && i.clientData[sym]._options.channels.length > 0){
                joinAll(sym, i.clientData[sym]._options.channels)
                .then(() => {
                    i.OberknechtEmitter[sym].emit(["client:autojoin", "autojoin"], i.clientData[sym]._options.channels);
                })
                .catch(e => {
                    i.OberknechtEmitter[sym].emit(["error", "unhandledRejection"], e);
                })
            };
            
            break;
        }
        
        default: {
            break;
        }
    };
};

module.exports = messageParser;