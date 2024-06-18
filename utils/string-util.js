function snakeToCamel (str) {
    if (!str) return '';
    return str.toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substring(1));
}

/**
 * convert automation-car to AutomationCar
 * @param {string} str 
 * @returns 
 */
function kebabToPascal (str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.toLowerCase().replace(/(-\w)/g, match => match.toUpperCase().substring(1)).substring(1);
}

module.exports = { snakeToCamel, kebabToPascal }