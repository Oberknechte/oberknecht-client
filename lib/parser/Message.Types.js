const clearchatMsg = require("./CLEARCHAT.Message");
const globaluserstateMsg = require("./globaluserstate.Message");
const noticeMsg = require("./NOTICE.Message");
const privmsgMessage = require("./PRIVMSG.Message");
const usernoticeMsg = require("./USERNOTICE.Message");
const userstateMsg = require("./USERSTATE.Message");
const whisperMsg = require("./WHISPER.Message");

module.exports = {
    clearchatMsg,
    globaluserstateMsg,
    noticeMsg,
    privmsgMessage,
    usernoticeMsg,
    userstateMsg,
    whisperMsg
};