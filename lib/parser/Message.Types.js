const clearchatMessage = require("./CLEARCHAT.Message");
const globaluserstateMessage = require("./GLOBALUSERSTATE.Message");
const noticeMessage = require("./NOTICE.Message");
const privmsgMessage = require("./PRIVMSG.Message");
const usernoticeMessage = require("./USERNOTICE.Message");
const userstateMessage = require("./USERSTATE.Message");
const whisperMessage = require("./WHISPER.Message");
const roomstateMessage = require("./ROOMSTATE.Message");
const clearmsgMessage = require("./CLEARMSG.Message");


module.exports = {
    clearchatMessage,
    clearmsgMessage,
    globaluserstateMessage,
    noticeMessage,
    privmsgMessage,
    usernoticeMessage,
    userstateMessage,
    whisperMessage,
    roomstateMessage
};