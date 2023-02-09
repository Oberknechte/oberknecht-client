const clientOptions = {
    token: String(),
    // Token link generator: https://jubewe.github.io/oauthlink
    username: String(),
    channels: Array(),
    prefix: String(),
    clientid: String() || undefined,
    secure: Boolean()
};

module.exports = clientOptions;