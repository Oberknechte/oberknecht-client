/** @param {string} rawEmotes */
function messageEmotes(rawEmotes) {
    if (!(rawEmotes ?? undefined)) return [];
    return rawEmotes.split(",").map(a => {
        return a.split(":")[0];
    });
};

module.exports = messageEmotes;