/** @param {object} obj @param {boolean} parentkeynames */
function _getallobjectkeystree(obj, parentkeynames){
    if(!obj || typeof obj !== "object") return [];
    let keys = [];
    this._getobj = (obj2) => {
        Object.keys(obj2).forEach(o => {
            if(typeof obj2[o] === "object" && Object.keys(obj2[o])) {
                if(parentkeynames) keys.push(o);
                this._getobj(obj2[o]);
            } else {
                keys.push(o);
            };
        });
    };
    this._getobj(obj);
    
    return keys;
};

module.exports = _getallobjectkeystree;