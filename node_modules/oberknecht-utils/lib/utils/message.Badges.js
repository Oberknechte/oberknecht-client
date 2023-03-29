/** @param {string} badges */
function messageBadges(badges) {
    if (!(badges ?? undefined)) return {};
    let r = {};
    badges.split(",").forEach(a => {
        r[a.split("/")[0]] = a.split("/")[1];
    });
    return r;
};

module.exports = messageBadges;