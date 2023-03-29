/** @param {Array} array */
function _unchunkArray(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        result = result.concat(array[i]);
    }
    return result;
};

module.exports = _unchunkArray;