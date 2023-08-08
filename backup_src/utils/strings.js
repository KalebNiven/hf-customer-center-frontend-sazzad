/* Convert a string to camelCase */
export function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

/* Capitalize a string */
export function toCapitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

/* Capitalize all words in the string */
export function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

/* Truncate String */
export function truncateString(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};