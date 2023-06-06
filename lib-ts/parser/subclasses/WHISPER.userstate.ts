import { BadgesMap } from "oberknecht-utils";
import { whisperMessage } from "../WHISPER.Message";

export class userstate {
    _inp: whisperMessage;

    username: string;
    displayName: string;
    color: string;
    turbo: boolean;
    userType: string;
    badges: BadgesMap;
    badgesRaw: string;
    id: string;

    constructor(inp: whisperMessage) {
        this._inp = inp;

        this.username = inp.senderUserName;
        this.displayName = inp.senderDisplayName;
        this.color = inp.senderUserColor;
        this.turbo = inp.turbo;
        this.userType = inp.senderUserType;
        this.badges = inp.badges;
        this.badgesRaw = inp.badgesRaw;
        this.id = inp.senderUserID;
    };
};