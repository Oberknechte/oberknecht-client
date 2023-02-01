async function ping(){
    let i = require("../index");

    return i.emitTwitchAction("PING");
};

module.exports = ping;