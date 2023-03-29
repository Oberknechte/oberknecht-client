/**
 * @param {String} rawMessage 
 */
function messageParameters(rawMessage){
    if(!rawMessage || !rawMessage.startsWith("@")) return {};
    let parameters = {};
    if(rawMessage.startsWith("@")) rawMessage.split(" ")[0].substring(1).split(";").forEach(a => {return parameters[a.split("=")[0]] = a.split("=")[1]});
    return parameters;
};

module.exports = messageParameters;