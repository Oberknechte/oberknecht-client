const messageParameters = require("./util/messageParameters");

class globaluserstateMessage {
    _raw = String();
    ircParameters = Object();

    badgeInfo = String();
    badgeInfoRaw = String();

    badges = String();
    badgesRaw = String();

    color = String();
    colorRaw = String();

    displayName = String();

    emoteSets = Number();
    emoteSetsRaw = Number();

    userID = Number();
    userIDRaw = String();
    userType = String();

    /**
     * @param {String} rawMessage 
     */
    constructor(rawMessage){
        this._raw = rawMessage;

        let ircParameters = this.ircParameters = messageParameters(rawMessage);
        
        this.badgeInfo = ircParameters.badgeInfo;
        this.badgeInfoRaw = ircParameters.badgeInfoRaw;

        this.badges = ircParameters.badges;
        this.badgesRaw = ircParameters.badgesRaw;

        this.color = ircParameters.color;
        this.colorRaw = ircParameters.colorRaw;

        this.displayName = ircParameters.displayName;
        
        this.emoteSets = ircParameters.emoteSets;
        this.emoteSetsRaw = ircParameters.emoteSetsRaw;

        this.userID = ircParameters.userID;
        this.userIDRaw = ircParameters.userIDRaw;
    };
};

module.exports = globaluserstateMessage;