/** 
 * @param {string | array} queryname 
 * @param {string | array} queryparams
 * @param {boolean} firstquery 
 * @returns {string}
 */
function _joinurlquery(queryname, queryparams, firstquery){
    if(queryname && !queryparams || queryparams.length === 0){
        return "";
    } else if(!queryparams){
        queryparams = [...arguments];
        queryparams.shift();
    } else {
        if(!Array.isArray(queryparams)) queryparams = [queryparams];
    }

    let r = `${(firstquery ? "?" : "&")}`;
    if(typeof queryname === "string") r += `${queryname}=${queryparams.join(`&${queryname}=`)}`;
    else if(Array.isArray(queryname)) r += `${queryname.map((v,i) => {return `${v}=${queryparams[i]}`}).join("&")}`
    return r;
};

module.exports = _joinurlquery;