/** @param {String} eventName */
function expectedEventName(eventName) {
    this.expectedeventnames = {
        "ping": "pong",
        "join": "353"
    };

    let eventName_ = eventName.toLowerCase();

    if (this.expectedeventnames[eventName_]) {
        return this.expectedeventnames[eventName_].toUpperCase();
    } else if (Object.values(this.expectedeventnames).includes(eventName_)) {
        return this.expectedeventnames[Object.values(this.expectedeventnames).findIndex(eventName_)].toUpperCase();
    }

    return eventName.toUpperCase();
};

module.exports = expectedEventName;