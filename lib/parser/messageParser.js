const privmsgMessage = require("./privmsg.Message");
const globaluserstateMsg = require("./globaluserstate.Message");
const messageCommand = require("./util/messageCommand");
const joinAll = require("../operations/joinAll");

/**
 * @param {String} rawMessage 
 */
function messageParser(rawMessage){
    if(!(rawMessage ?? undefined)) throw new Error();
    rawMessage = rawMessage.replace(/\r\n$/g, "");
    
    let i = require("../index");

    let ircCommand = messageCommand(rawMessage);
    
    let rawMessages = rawMessage.split("\r\n");
    rawMessages.forEach(response_ => {
        i.OberknechtEmitter.emit(["irc:unparsedmessage"], response_);
        let ircCommand_ = messageCommand(response_);
        i.OberknechtactionEmitter.emit(ircCommand_, response_);
    });
    
    rawMessage = rawMessages[0];

    switch (ircCommand){
        case "GLOBALUSERSTATE": {
            i.OberknechtEmitter.emit(["irc:globaluserstate","GLOBALUSERSTATE"], new globaluserstateMsg(rawMessage));
            break;
        }

        case "PRIVMSG": {
            i.OberknechtEmitter.emit(["irc:privmsg","PRIVMSG"], new privmsgMessage(rawMessage));
            break;
        }

        case "PING": {
            i.OberknechtEmitter.emit(["irc:ping","PING"]);
            i.reconnectingKnecht.send("PONG");
            break;
        };

        case "PONG": {
            i.OberknechtEmitter.emit(["irc:pong","PONG"]);
            break;
        }
        
        case "375": {
            i.OberknechtEmitter.emit(["client:ready","irc:open","irc:ready","ready"], rawMessage);
            
            if(i.clientData._options.channels && i.clientData._options.channels.length > 0){
                i.OberknechtEmitter.emit(["debug"], i.clientData._options.channels);
                joinAll(i.clientData._options.channels)
                .then(() => {
                    i.OberknechtEmitter.emit(["client:autojoin", "autojoin"], i.clientData._options.channels);
                })
            };
            
            break;
        }
        
        case "001", "002", "003", "004", "372", "353": {
            break;
        }
    };
};

module.exports = messageParser;