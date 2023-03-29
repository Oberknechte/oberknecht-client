const oberknechtAPIOptions = {
    debug: Number(),
    token: String(),
    startPath: String() ?? "package path",
    saveIDs: Boolean(),
    saveIDsPath: String(),
    filechange_interval: Number() ?? 10000
};

module.exports = oberknechtAPIOptions;