import {
  BadgesMap,
  messageBadges,
  messageEmoteSets,
  messageParameters,
} from "oberknecht-utils";

export class globaluserstateMessage {
  sym;
  _raw: string;
  timestamp: number;
  ircParameters: object;

  badgeInfo: string;
  badgeInfoRaw: string;

  badges: BadgesMap;
  badgesRaw: string;

  color: string;
  colorRaw: string;

  displayName: string;

  emoteSets: string[];
  emoteSetsRaw: string;

  turbo: boolean;

  userID: string;
  userIDRaw: string;
  userType: string;

  constructor(sym: string, rawMessage: string) {
    const dn = Date.now();
    this.timestamp = dn;
    this.sym = sym;
    this._raw = rawMessage;

    let ircParameters = (this.ircParameters = messageParameters(rawMessage));

    this.badgeInfo = ircParameters.badgeInfo;
    this.badgeInfoRaw = ircParameters.badgeInfoRaw;

    this.badgesRaw = ircParameters.badgesRaw;
    this.badges = messageBadges(this.badgesRaw);

    this.colorRaw = ircParameters.colorRaw;
    this.color = ircParameters.color;

    this.displayName = ircParameters.displayName;

    this.emoteSetsRaw = ircParameters.emoteSetsRaw;
    this.emoteSets = messageEmoteSets(this.emoteSetsRaw);

    this.turbo = ircParameters.turbo === "1";

    this.userID = ircParameters.userID;
    this.userIDRaw = ircParameters.userIDRaw;
  }
}
