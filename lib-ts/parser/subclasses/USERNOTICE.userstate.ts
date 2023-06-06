import { BadgesMap } from "oberknecht-utils";
import { usernoticeMessage } from "../USERNOTICE.Message";

export class userstate {
    _inp: usernoticeMessage;

    username: string;
    displayName: string;
    color: string;
    isMod: boolean;
    subscriber: boolean;
    userType: string;
    badgeInfo: string;
    badges: BadgesMap;
    badgesRaw: string;
    id: string;

    ban: Function;
    unban: Function;
    timeout: Function;
    untimeout: Function;
    shoutout: Function;

    constructor(inp: usernoticeMessage) {
        this._inp = inp;

        this.username = inp.senderUserName;
        this.displayName = inp.senderDisplayName;
        this.color = inp.senderUserColor;
        this.isMod = inp.isMod;
        this.subscriber = inp.isSubscriber;
        this.userType = inp.senderUserType;
        this.badgeInfo = inp.badgeInfo;
        this.badges = inp.badges;
        this.badgesRaw = inp.badgesRaw;
        this.id = inp.senderUserID;

        this.ban = inp.ban;
        this.unban = inp.unban;
        this.timeout = inp.timeout;
        this.untimeout = inp.untimeout;
        this.shoutout = inp.shoutout;
    };
};