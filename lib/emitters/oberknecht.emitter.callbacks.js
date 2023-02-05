const clearchatMsg = require("../parser/CLEARCHAT.Message");
const globaluserstateMsg = require("../parser/globaluserstate.Message");
const noticeMsg = require("../parser/NOTICE.Message");
const privmsgMessage = require("../parser/PRIVMSG.Message");
const usernoticeMsg = require("../parser/USERNOTICE.Message");
const userstateMsg = require("../parser/USERSTATE.Message");
const whisperMsg = require("../parser/WHISPER.Message");

let onPRIVMSGcallback = /**@param {privmsgMessage} privmsg */ (privmsg) => {privmsg};
let onGLOBALUSERSTATEcallback = /**@param {globaluserstateMsg} globaluserstate */ (globaluserstate) => {};
let onCLEARCHATcallback = /**@param {clearchatMsg} clearchat */ (clearchat) => {};
let onNOTICEcallback = /**@param {noticeMsg} notice */ (notice) => {};
let onUSERNOTICEcallback = /**@param {usernoticeMsg} usernotice */ (usernotice) => {};
let onUSERSTATEcallback = /**@param {userstateMsg} userstate */ (userstate) => {};
let onWHISPERcallback = /**@param {whisperMsg} whisper */ (whisper) => {};

module.exports = {
    onPRIVMSGcallback,
    onGLOBALUSERSTATEcallback,
    onCLEARCHATcallback,
    onNOTICEcallback,
    onUSERNOTICEcallback,
    onUSERSTATEcallback,
    onWHISPERcallback
};