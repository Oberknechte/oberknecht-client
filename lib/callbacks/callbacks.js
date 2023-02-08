const onCLEARCHATcallback = require("./onCLEARCHAT.callback");
const onErrorcallback = require("./onError.callback");
const onGLOBALUSERSTATEcallback = require("./onGLOBALUSERSTATE.callback");
const onNOTICEcallback = require("./onNOTICE.callback");
const onPRIVMSGcallback = require("./onPRIVMSG.callback");
const onUSERNOTICEcallback = require("./onUSERNOTICE.callback");
const onUSERSTATEcallback = require("./onUSERSTATE.callback");
const onWHISPERcallback = require("./onWHISPER.callback");

module.exports = {
    onCLEARCHATcallback,
    onErrorcallback,
    onGLOBALUSERSTATEcallback,
    onNOTICEcallback,
    onPRIVMSGcallback,
    onUSERNOTICEcallback,
    onUSERSTATEcallback,
    onWHISPERcallback
};