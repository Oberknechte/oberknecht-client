const messageCommand = require("./util/messageCommand");
const joinAll = require("../operations/joinAll");
const messageTypes = require("./Message.Types");

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
        i.OberknechtActionEmitter.emit(ircCommand_, response_);
    });
    
    rawMessage = rawMessages[0];
    

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
            i.OberknechtEmitter.emit([`irc:${ircCommand.toLowerCase()}`, ircCommand], new messageTypes[`${ircCommand.toLowerCase()}Message`](rawMessage));
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
        
        default: {
            break;
        }
    };
};

module.exports = messageParser;