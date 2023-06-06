"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSym = void 0;
let n = 0;
function createSym() {
    return (n++).toString();
}
exports.createSym = createSym;
;
