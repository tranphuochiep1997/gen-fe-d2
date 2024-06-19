const listInputTypeShouldHaveValueMapping = ['select', 'radio'];

function shouldPropertyUseConstantVariable(property) {
    const { field, inputType } = property;
    if (typeof field === 'string' && field !== '') {
        return listInputTypeShouldHaveValueMapping.includes(inputType)
    }
    return false;
}

module.exports = { shouldPropertyUseConstantVariable }