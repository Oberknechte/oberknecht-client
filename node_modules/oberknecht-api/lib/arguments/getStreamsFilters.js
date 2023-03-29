const getStreamsFilters = {
    user_id: Array(),
    user_login: Array(),
    game_id: Array(),
    type: "all" || "live",
    language: Array(),
    first: Number(),
    before: String(),
    after: String()
};

module.exports = getStreamsFilters;