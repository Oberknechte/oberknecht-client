/**
 * @param {string} rawEmoteSets 
 */
function messageEmoteSets(rawEmoteSets){
    if(!(rawEmoteSets ?? undefined)) return [];
    return rawEmoteSets.split(",");
};

module.exports = messageEmoteSets;