function snakeToCamelCase (str) {
    if (!str) return '';
    return str.toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substring(1));
}

/**
 * convert automation-car to AutomationCar
 * @param {string} str 
 * @returns 
 */
function kebabToPascalCase (str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.toLowerCase().replace(/(-\w)/g, match => match.toUpperCase().substring(1)).substring(1);
}

/**
 * convert carNumber to CAR_NUMBER
 * @param {string} str 
 */
function camelToUpperSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter}`).toUpperCase();
}

module.exports = { snakeToCamelCase, kebabToPascalCase, camelToUpperSnakeCase }