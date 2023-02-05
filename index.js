// export * from "./lib/client/oberknecht.client";
// export * from "./lib/export.mjs";

const oberknechtClient = require("./lib/client/oberknecht.client");

// require("./lib/emitters/oberknecht.emitter.callbacks");

require("./lib/client/oberknecht.client");
require("./lib/parser/Message.Types");

// module.exports = {
//     oberknechtClient: oberknechtClient,
//     ...require("./lib/parser/Message.Types"),
// };