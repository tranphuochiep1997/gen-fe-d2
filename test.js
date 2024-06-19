function createFeatureGroupBreadcums(breadcrumbs) {
    let breadcrumbsString = '';
    if (breadcrumbs && breadcrumbs.length > 0) {
        breadcrumbsString = breadcrumbs.map(b => `'${b}', `).join('');
    }
    return breadcrumbsString;
}

const breadcrumbs = ["Quản trị hệ thống"]

const { camelToUpperSnakeCase } = require('./utils/string-util');

const listInputTypeShouldHaveValueMapping = ['select', 'radio'];
const deplayInputMapping = [{ value: 'value1', display: 'display1' }];
function genConstantVariables(destinationFilePath, featureConfig) {
    const { properties } = featureConfig;
    const propertiesWithValueMapping = properties
        .filter(prop => listInputTypeShouldHaveValueMapping.includes(prop.inputType))
        .map(prop => !prop.inputMapping ? {...prop, inputMapping: deplayInputMapping} : prop);
    let fileContent = propertiesWithValueMapping.map(prop => {
        const variableName = camelToUpperSnakeCase(prop.field);
        const listValueDisplay = prop.inputMapping.map(item => JSON.stringify(item)).join(',\n')
        return `export const ${variableName} = [\n${listValueDisplay}\n]`;
    }).join('\n\n');
    fileContent = fileContent.replaceAll(/{"value":/g, '    { value: ')
    .replaceAll(/,"display":/g, ', display: ')
    .replaceAll(/"}/g, '" }')
    .replaceAll(/"/g, "'");
    return fileContent;
}

const featureConfig = JSON.parse(`{
    "name": "Người dùng hệ thống",
    "feature": "user",
    "apiUri": {
        "getList": "/v1/users",
        "create": "/v1/users",
        "update": "/v1/users",
        "lock": "/v1/users/lock?id=:id",
        "delete": "/v1/users/:id"
    },
    "properties": [
        {
            "name": "Mã quyền người dùng",
            "field": "code",
            "dataType": "string",
            "inputType": "text"
        },
        {
            "name": "Tên quyền người dùng",
            "field": "name",
            "dataType": "string",
            "inputType": "text"
        },
        {
            "name": "Số tuổi",
            "field": "age",
            "dataType": "number",
            "inputType": "number"
        },
        {
            "name": "Thể loại phim yêu thích",
            "field": "favouriteFilm",
            "dataType": "string",
            "inputType": "select",
            "inputMapping": [
                { "value": "CARTOON", "display": "Hoạt hình"},
                { "value": "COMEDY", "display": "Hài kịch"},
                { "value": "HORROR", "display": "Kinh dị"},
                { "value": "ACTION", "display": "Hành động"}
            ]
        },
        {
            "name": "Trạng thái",
            "field": "status",
            "dataType": "string",
            "inputType": "radio",
            "inputMapping": [
                { "value": "ACTIVE", "display": "Hoạt động"},
                { "value": "INACTIVE", "display": "Không hoạt động"}
            ]
        },
        {
            "name": "Ăn trái cây",
            "field": "fruit",
            "dataType": "boolean",
            "inputType": "checkbox"
        },
        {
            "name": "Ngày bắt đầu",
            "field": "startDate",
            "dataType": "Date",
            "inputType": "date-picker"
        }
    ]
}`)
genConstantVariables('', featureConfig)