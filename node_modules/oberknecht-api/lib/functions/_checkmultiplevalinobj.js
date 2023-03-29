/** @param {object} obj @param {array} val */
function _checkmultiplevaliinobj(obj, val){
    let currentobj = obj;
    for(let val2 in val){
        if(typeof currentobj === "object"){
            if(Object.keys(obj).includes(val[val2]) || (val2 == val.length && obj === val[val2])){
                obj = obj[val[val2]];
            } else if (Array.isArray(val[val2]) && Object.keys(obj).filter(objk => {return val[val2].includes(objk)}).length > 0){
                obj = obj[val[val2][Object.keys(obj).filter(objk => {return val[val2].includes(objk)})[0]]];
            } else {
                return false;
            };
        } else {
            return false;
        };
    };
    return true;
};

module.exports = _checkmultiplevaliinobj;