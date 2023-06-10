"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotice = void 0;
let __1 = require("..");
let NOTICE_Message_1 = require("../parser/NOTICE.Message");
function handleNotice(sym, rawMessage, wsnum) {
    let notice = new NOTICE_Message_1.noticeMessage(sym, rawMessage);
    if (!__1.i.clientData[sym])
        return;
    wsnum = wsnum ?? __1.i.clientData[sym]?.currentKnecht;
    __1.i.OberknechtEmitter[sym]?.emit(["irc:notice", `irc:${wsnum}:notice`], rawMessage);
    switch (notice.msgID) {
        case "cmds_available":
        //Commands available to you in this room (use /help for details): <list of commands> More help: https://help.twitch.tv/s/article/chat-"commands".
        case "no_help":
        //No help "available".
        case "bad_ban_admin":
        //You cannot ban admin <user>. Please ema   il support@twitch.tv if an admin is being "abusive".
        case "bad_ban_anon":
        //You cannot ban anonymous "users".
        case "bad_ban_broadcaster":
        //You cannot ban the "broadcaster".
        case "bad_ban_mod":
        //You cannot ban moderator <user> unless you are the owner of this "channel".
        case "bad_ban_self":
        //You cannot ban "yourself".
        case "bad_ban_staff":
        //You cannot ban a staff <user>. Please email support@twitch.tv if a staff member is being "abusive".
        case "bad_commercial_error":
        //Failed to start the "commercial".
        case "bad_delete_message_broadcaster":
        //You cannot delete the broadcaster’s "messages".
        case "bad_delete_message_mod":
        //You cannot delete messages from another moderator <user">".
        case "bad_host_error":
        //There was a problem hosting <channel>. Please try again in a "minute".
        case "bad_host_hosting":
        //This channel is already hosting <channel">".
        case "bad_host_rate_exceeded":
        //Host target cannot be changed more than <number> times every half "hour".
        case "bad_host_rejected":
        //This channel is unable to be "hosted".
        case "bad_host_self":
        //A channel cannot host "itself".
        case "bad_mod_banned":
        //<user> is banned in this channel. You must unban this user before granting mod "status".
        case "bad_slow_duration":
        //You cannot set slow delay to more than <number> "seconds".
        case "bad_timeout_admin":
        //You cannot timeout admin <user>. Please email support@twitch.tv if an admin is being "abusive".
        case "bad_timeout_anon":
        //You cannot timeout anonymous "users".
        case "bad_timeout_broadcaster":
        //You cannot timeout the "broadcaster".
        case "bad_timeout_duration":
        //You cannot time a user out for more than <seconds">".
        case "bad_timeout_mod":
        //You cannot timeout moderator <user> unless you are the owner of this "channel".
        case "bad_timeout_self":
        //You cannot timeout "yourself".
        case "bad_timeout_staff":
        //You cannot timeout staff <user>. Please email support@twitch.tv if a staff member is being "abusive".
        case "bad_unhost_error":
        //There was a problem exiting host mode. Please try again in a "minute".
        case "bad_unmod_mod":
        //<user> is not a moderator of this "channel".
        case "bad_vip_grantee_banned":
        //<user> is banned in this channel. You must unban this user before granting VIP "status".
        case "bad_vip_grantee_already_vip":
        //<user> is already a VIP of this "channel".
        case "bad_vip_max_vips_reached":
        //Unable to add VIP. Visit the Achievements page on your dashboard to learn how to unlock additional VIP "slots".
        case "bad_vip_achievement_incomplete":
        //Unable to add VIP. Visit the Achievements page on your dashboard to learn how to unlock this "feature".
        case "bad_unvip_grantee_not_vip":
        //<user> is not a VIP of this "channel".
        case "tos_ban":
        //The community has closed channel <channel> due to Terms of Service "violations".
        case "unavailable_command":
        //Sorry, “<command>” is not available through this "client".
        case "invalid_user":
        //Invalid username: <"user">
        case "raid_error_already_raiding":
        //You already have a raid in "progress".
        case "raid_error_forbidden":
        //You cannot raid this "channel".
        case "raid_error_self":
        //A channel cannot raid "itself".
        case "raid_error_too_many_viewers":
        //Sorry, you have more viewers than the maximum currently supported by raids right "now".
        case "raid_error_unexpected":
        //There was a problem raiding <channel>. Please try again in a "minute".
        case "msg_banned":
        //You are permanently banned from talking in <channel">".
        case "msg_bad_characters":
        //Your message was not sent because it contained too many unprocessable characters. If you believe this is an error, please rephrase and try "again".
        case "msg_channel_blocked":
        //Your message was not sent because your account is not in good standing in this "channel".
        case "turbo_only_color":
        //Only turbo users can specify an arbitrary hex color. Use one of the following instead: <list of colors">".
        case "unraid_error_no_active_raid":
        //You do not have an active "raid".
        case "unraid_error_unexpected":
        //There was a problem stopping the raid. Please try again in a "minute".
        case "unrecognized_cmd":
        //Unrecognized command: <"command">
        case "untimeout_banned":
        //<user> is permanently banned. Use “/unban” to remove a "ban".
        // RESPONSE ANY MESSAGE
        case "msg_duplicate":
        //Your message was not sent because it is identical to the previous one you sent, less than 30 seconds "ago".
        case "no_permission":
        //You don’t have permission to perform that "action".
        case "msg_emoteonly":
        //This room is in emote-only mode. You can find your currently available emoticons using the smiley in the chat text "area".
        case "msg_followersonly":
        //This room is in <duration> followers-only mode. Follow <channel> to join the community! Note: These msg_followers tags are kickbacks to a user who does not meet the criteria; that is, does not follow or has not followed long "enough".
        case "msg_followersonly_followed":
        //This room is in <duration1> followers-only mode. You have been following for <duration2>. Continue following to "chat"!
        case "msg_followersonly_zero":
        //This room is in followers-only mode. Follow <channel> to join the "community"!
        case "msg_r9k":
        //This room is in unique-chat mode and the message you attempted to send is not "unique".
        case "msg_ratelimit":
        //Your message was not sent because you are sending messages too "quickly".
        case "msg_rejected":
        //Hey! Your message is being checked by mods and has not been "sent".
        case "msg_rejected_mandatory":
        //Your message wasn’t posted due to conflicts with the channel’s moderation "settings".
        case "msg_requires_verified_phone_number":
        //A verified phone number is required to chat in this channel. Please visit https://www.twitch.tv/settings/security to verify your phone "number".
        case "msg_slowmode":
        //This room is in slow mode and you are sending messages too quickly. You will be able to talk again in <number> "seconds".
        case "msg_subsonly":
        //This room is in subscribers only mode. To talk, purchase a channel subscription at https://www.twitch.tv/products/<broadcaster login name>/ticket?ref="subscriber_only_mode_chat".
        case "msg_suspended":
        //You don’t have permission to perform that "action".
        case "msg_timedout":
        //You are timed out for <number> more "seconds".
        case "msg_verified_email":
        //This room requires a verified account to chat. Please verify your account at https://www.twitch.tv/settings/"security".
        case "whisper_banned":
        //You have been banned from sending "whispers".
        case "whisper_banned_recipient":
        //That user has been banned from receiving whispers.
        case "whisper_invalid_login":
        //No user matching that username.
        case "whisper_invalid_self":
        //You cannot whisper to yourself.
        case "whisper_limit_per_min":
        //You are sending whispers too fast. Try again in a minute.
        case "whisper_limit_per_sec":
        //You are sending whispers too fast. Try again in a second.
        case "whisper_restricted":
        //Your settings prevent you from sending this whisper.
        case "whisper_restricted_recipient": //That user’s settings prevent them from receiving this whisper
            {
                __1.i.OberknechtEmitter[sym].emit(["irc:notice:reject"], rawMessage);
                __1.i.OberknechtActionEmitter[sym].emitreject("PRIVMSG", rawMessage);
                break;
            }
        // WARN/INFO MESSAGES
        case "raid_notice_mature":
        //This channel is intended for mature "audiences".
        case "raid_notice_restricted_chat":
        //This channel has follower- or subscriber-only "chat".
        case "not_hosting":
        //No channel is currently being "hosted".
        case "no_mods":
        //There are no moderators of this "channel".
        case "room_mods":
        //The moderators of this channel are: <list of "users">
        case "no_vips":
        //This channel does not have any "VIPs".
        case "vips_success":
        //The VIPs of this channel are: <list of users">".
        case "mod_success":
        //You have added <user> as a moderator of this "channel".
        case "timeout_success":
        //<user> has been timed out for <duration">".
        case "unban_success":
        //<user> is no longer banned from this "channel".
        case "unraid_success":
        //The raid has been "canceled".
        case "untimeout_success":
        //<user> is no longer timed out in this "channel".
        case "unvip_success":
        //You have removed <user> as a VIP of this "channel".
        case "unmod_success":
        //You have removed <user> as a moderator of this "channel".
        case "vip_success":
        //You have added <user> as a vip of this "channel".
        case "ban_success":
        //<user> is now banned from this "channel".
        case "color_changed":
        //Your color has been "changed".
        case "commercial_success":
        //Initiating <number> second commercial break. Keep in mind that your stream is still live and not everyone will get a "commercial".
        case "delete_message_success":
        //The message from <user> is now "deleted".
        case "delete_staff_message_success": //You deleted a message from staff <user>. Please email support@twitch.tv if a staff member is being "abusive".
            {
                __1.i.OberknechtEmitter[sym].emit(["irc:notice:resolve", `irc:${wsnum}:notice:resolve`], rawMessage);
                __1.i.OberknechtActionEmitter[sym].emitresolve("PRIVMSG", rawMessage);
                break;
            }
        // SUCCESS UNSUCCESS RESPONSE
        case "timeout_no_timeout":
        //<user> is not timed out from this "channel".
        case "already_banned":
        //<user> is already banned in this "channel".
        case "already_emote_only_off":
        //This room is not in emote-only "mode".
        case "already_emote_only_on":
        //This room is already in emote-only "mode".
        case "already_followers_off":
        //This room is not in followers-only "mode".
        case "already_followers_on":
        //This room is already in <duration> followers-only "mode".
        case "already_r9k_off":
        //This room is not in unique-chat "mode".
        case "already_r9k_on":
        //This room is already in unique-chat "mode".
        case "already_slow_off":
        //This room is not in slow "mode".
        case "already_slow_on":
        //This room is already in <duration>-second slow "mode".
        case "already_subs_off":
        //This room is not in subscribers-only "mode".
        case "already_subs_on":
        //This room is already in subscribers-only "mode".
        case "bad_unban_no_ban":
        //<user> is not banned from this "channel".
        case "bad_mod_mod": //<user> is already a moderator of this "channel".
            {
                __1.i.OberknechtEmitter[sym].emit([
                    "irc:notice:rejectsuccess",
                    "irc:notice:success",
                    `irc:${wsnum}:notice:rejectsuccess`,
                    `irc:${wsnum}:notice:success`,
                ], rawMessage);
                break;
            }
        case "usage_ban":
        //Usage: “/ban <username> [reason]” Permanently prevent a user from chatting. Reason is optional and will be shown to the target and other moderators. Use “/unban” to remove a "ban".
        case "usage_clear":
        //Usage: “/clear”\nClear chat history for all users in this "room".
        case "usage_color":
        //Usage: “/color” <color>\nChange your username color. Color must be in hex (#000000) or one of the following: <list of colors">".
        case "usage_commercial":
        //Usage: “/commercial [length]”\nTriggers a commercial. Length (optional) must be a positive number of "seconds".
        case "usage_disconnect":
        //Usage: “/disconnect”\nReconnects to "chat".
        case "usage_delete":
        //Usage: “/delete <msg id>” - Deletes the specified message. For more information, see https://dev.twitch.tv/docs/irc/commands/#clearmsg-twitch-"commands".
        case "usage_emote_only_off":
        //Usage: /emoteonlyoff”\nDisables emote-only "mode".
        case "usage_emote_only_on":
        //Usage: “/emoteonly”\nEnables emote-only mode (only emoticons may be used in chat). Use /emoteonlyoff to "disable".
        case "usage_followers_off":
        //Usage: /followersoff”\nDisables followers-only "mode".
        case "usage_followers_on":
        //Usage: “/followers\nEnables followers-only mode (only users who have followed for “duration” may chat). Examples: “30m”, “1 week”, “5 days 12 hours”. Must be less than 3 "months".
        case "usage_help":
        //Usage: “/help”\nLists the commands available to you in this "room".
        case "usage_host":
        //Usage: “/host <channel>“\nHost another channel. Use “/unhost” to unset host "mode".
        case "usage_marker":
        //Usage: “/marker <optional comment>“\nAdds a stream marker (with an optional comment, max 140 characters) at the current timestamp. You can use markers in the Highlighter for easier "editing".
        case "usage_me":
        //Usage: “/me <message>” - Express an action in the third-"person".
        case "usage_mod":
        //Usage: “/mod <username>” - Grant moderator status to a user. Use “/mods” to list the moderators of this "channel".
        case "usage_mods":
        //Usage: “/mods”\nLists the moderators of this "channel".
        case "usage_r9k_off":
        //Usage: “/uniquechatoff” - Disables unique-chat "mode".
        case "usage_r9k_on":
        //Usage: “/uniquechat” - Enables unique-chat mode. Use “/uniquechatoff” to "disable".
        case "usage_raid":
        //Usage: “/raid <channel>“\nRaid another channel.\nUse “/unraid” to cancel the "Raid".
        case "usage_slow_off":
        //Usage: “/slowoff”\nDisables slow "mode".
        case "usage_slow_on":
        //Usage: “/slow” [duration]\nEnables slow mode (limit how often users may send messages). Duration (optional, default=<number>) must be a positive integer number of seconds.\nUse “/slowoff” to "disable".
        case "usage_subs_off":
        //Usage: “/subscribersoff”\nDisables subscribers-only "mode".
        case "usage_subs_on":
        //Usage: “/subscribers”\nEnables subscribers-only mode (only subscribers may chat in this channel).\nUse “/subscribersoff” to "disable".
        case "usage_timeout":
        //Usage: “/timeout <username> [duration][time unit] [reason]”\nTemporarily prevent a user from chatting. Duration (optional, default=10 minutes) must be a positive integer; time unit (optional, default=s) must be one of s, m, h, d, w; maximum duration is 2 weeks. Combinations like 1d2h are also allowed. Reason is optional and will be shown to the target user and other moderators.\nUse “untimeout” to remove a "timeout".
        case "usage_unban":
        //Usage: “/unban <username>“\nRemoves a ban on a "user".
        case "usage_unhost":
        //Usage: “/unhost”\nStop hosting another "channel".
        case "usage_unmod":
        //Usage: “/unmod <username>” - Revoke moderator status from a user. Use “/mods” to list the moderators of this "channel".
        case "usage_unraid":
        //Usage: “/unraid”\nCancel the "Raid".
        case "usage_untimeout":
        //Usage: “/untimeout <username>“\nRemoves a timeout on a "user".
        case "usage_unvip":
        //Usage: “/unvip <username>” - Revoke VIP status from a user. Use “/vips” to list the VIPs of this "channel".
        case "usage_user":
        //Usage: “/user” <username> - Display information about a specific user on this "channel".
        case "usage_vip":
        //Usage: “/vip <username>” - Grant VIP status to a user. Use “/vips” to list the VIPs of this "channel".
        case "usage_vips":
        //Usage: “/vips” - Lists the VIPs of this "channel".
        case "usage_whisper": //Usage: “/w <username> <"message>"”
            {
                __1.i.OberknechtEmitter[sym].emit(["irc:notice:usage", `irc:${wsnum}:notice:usage`], rawMessage);
                break;
            }
        // INFO MESSAGES
        case "slow_off":
        //This room is no longer in slow "mode".
        case "slow_on":
        //This room is now in slow mode. You may send messages every <number> "seconds".
        case "emote_only_off":
        //This room is no longer in emote-only "mode".
        case "emote_only_on":
        //This room is now in emote-only "mode".
        case "followers_off":
        //This room is no longer in followers-only "mode".
        case "followers_on":
        //This room is now in <duration> followers-only "mode".
        case "followers_on_zero":
        //This room is now in followers-only "mode".
        case "host_off":
        //Exited host "mode".
        case "host_on":
        //Now hosting <channel">".
        case "host_receive":
        //<channel> is now hosting you for up to <number> "viewers".
        case "host_receive_no_count":
        //<channel> is now hosting "you".
        case "host_target_went_offline":
        //<channel> has gone offline. Exiting host "mode".
        case "hosts_remaining":
        //<number> host commands remaining this half "hour".
        case "autohost_receive":
        //<user> is now auto hosting you for up to <number> "viewers".
        case "r9k_off":
        //This room is no longer in unique-chat "mode".
        case "r9k_on":
        //This room is now in unique-chat "mode".
        case "subs_off":
        //This room is no longer in subscribers-only "mode".
        case "subs_on": //This room is now in subscribers-only "mode".
            {
                __1.i.OberknechtEmitter[sym].emit(["irc:notice:info", `irc:${wsnum}:notice:info`], rawMessage);
                break;
            }
        // ACTION EMITTER MESSAGES
        case "msg_channel_suspended": //This channel does not exist or has been "suspended".
            {
                __1.i.OberknechtActionEmitter[sym].emitreject("353", "This channel does not exist or has been suspended.");
                break;
            }
    }
}
exports.handleNotice = handleNotice;
