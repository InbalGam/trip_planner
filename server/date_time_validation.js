function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
};


function validateHhMm(inputField) {
    const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);
    return isValid;
};

module.exports = {
    isValidDate,
    validateHhMm
};