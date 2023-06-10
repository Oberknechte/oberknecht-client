import { i } from "../..";
import { privmsgMessage } from "../PRIVMSG.Message";

export class userstate {
  _inp: privmsgMessage;

  username: string;
  displayName: string;
  color: string;
  isMod: boolean;
  isVip: boolean;
  subscriber: boolean;
  turbo: boolean;
  userType: string;
  badgeInfo: string;
  badges: object;
  badgesRaw: string;
  id: string;

  constructor(inp: privmsgMessage) {
    this._inp = inp;

    this.username = inp.senderUserName;
    this.displayName = inp.senderDisplayName;
    this.color = inp.senderUserColor;
    this.isMod = inp.isMod;
    this.isVip = inp.isVip;
    this.subscriber = inp.isSubscriber;
    this.turbo = inp.turbo;
    this.userType = inp.senderUserType;
    this.badgeInfo = inp.badgeInfo;
    this.badges = inp.badges;
    this.badgesRaw = inp.badgesRaw;
    this.id = inp.senderUserID;
  }

  async ban(reason) {
    return i.OberknechtAPI[this._inp.sym].ban(
      this._inp.channelID,
      this._inp.senderUserID,
      reason
    );
  }
  async unban() {
    return i.OberknechtAPI[this._inp.sym].unban(
      this._inp.channelID,
      this._inp.senderUserID
    );
  }
  async timeout(duration, reason) {
    return i.OberknechtAPI[this._inp.sym].timeout(
      this._inp.channelID,
      this._inp.senderUserID,
      duration,
      reason
    );
  }
  async untimeout() {
    return i.OberknechtAPI[this._inp.sym].unban(
      this._inp.channelID,
      this._inp.senderUserID
    );
  }
  async shoutout() {
    return i.OberknechtAPI[this._inp.sym].shoutout(
      this._inp.channelID,
      this._inp.senderUserID
    );
  }

  async mod() {
    return i.OberknechtAPI[this._inp.sym].mod(this._inp.senderUserID);
  }
  async unmod() {
    return i.OberknechtAPI[this._inp.sym].unmod(this._inp.senderUserID);
  }
  async vip() {
    return i.OberknechtAPI[this._inp.sym].vip(this._inp.senderUserID);
  }
  async unvip() {
    return i.OberknechtAPI[this._inp.sym].unvip(this._inp.senderUserID);
  }
}
