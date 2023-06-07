"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getuser = void 0;
let getusers_1 = require("./getusers");
async function getuser(sym, login, id, noautofilterids) {
    return new Promise((resolve, reject) => {
        (0, getusers_1.getusers)(sym, login, id, noautofilterids)
            .then(u => {
            resolve(u[0]);
        })
            .catch(reject);
    });
}
exports.getuser = getuser;
;
