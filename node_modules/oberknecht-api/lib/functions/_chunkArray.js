/**
 * @param {array} array 
 * @param {number} size 
 * @see https://github.com/NuroC/moomoo-in-depth/tree/main/protocol#chunk-arrays
 * @returns {array}
 */

function _chunkArray(array, size){
    let result = [];
    for (let i = 0; i < array.length; i += size) {
        let chunk = array.slice(i, i + size);
        result.push(chunk);
    }
    return result;
};

module.exports = _chunkArray;