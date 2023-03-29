const updateChatSettings = require("../endpoints/updateChatSettings");

class _updateSingleChatSetting {
    static slow = (sym, broadcaster_id, wait_time, customtoken) => { return updateChatSettings(sym, broadcaster_id, { slow_mode: true, slow_mode_wait_time: wait_time }, customtoken) };
    static slowOff = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { slow_mode: false }, customtoken) };
 
    static followers = (sym, broadcaster_id, duration, customtoken) => { return updateChatSettings(sym, broadcaster_id, { follower_mode: true, follower_mode_duration: duration }, customtoken) };
    static followersOff = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { follower_mode: false }, customtoken) };
 
    static subscribers = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { subscriber_mode: true }, customtoken) };
    static subscribersOff = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { subscriber_mode: false }, customtoken) };
 
    static emote = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { emote_mode: true }, customtoken) };
    static emoteOff = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { emote_mode: false }, customtoken) };
 
    static r9k = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { unique_chat_mode: true }, customtoken) };
    static r9kOff = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { unique_chat_mode: false }, customtoken) };
 
    static chatdelay = (sym, broadcaster_id, duration, customtoken) => { return updateChatSettings(sym, broadcaster_id, { non_moderator_chat_delay: true, non_moderator_chat_delay_duration: duration }, customtoken) };
    static chatdelayOff = (sym, broadcaster_id, customtoken) => { return updateChatSettings(sym, broadcaster_id, { non_moderator_chat_delay: false }, customtoken) };
};

module.exports = _updateSingleChatSetting;