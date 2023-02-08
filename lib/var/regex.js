module.exports = {
    numregex: () => {return new RegExp(`^([\\d]{1,})$`, "g")},
    tokenreg: () => {return new RegExp(`^\\b[\\w]{30}\\b$`, "g")},
    jsonreg: () => {return new RegExp(`^\\{+[\\W\\w]*\\}$`, "g")},
    urlreg: () => {return new RegExp(`(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})`, "g")},
    twitch: {
        message: {
            action: () => {return /^\u0001ACTION (.*)\u0001$/}
        },
        usernamereg: () => {return new RegExp(`\\b^[\\w]{1,32}$\\b`, "g")}
    }
};