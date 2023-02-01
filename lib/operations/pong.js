async function pong(){
    let i = require("../index");

    return i.emitTwitchAction("PONG");
};

module.exports = pong;