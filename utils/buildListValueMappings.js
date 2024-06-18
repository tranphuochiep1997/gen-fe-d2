const { kebabToPascal } = require('./string-util');

function buildFormItemFromPropertyConfig(property) {
    const { name, field, inputType, inputMapping } = property;
    let itemTemplate = `        <nz-form-item>
            <nz-form-label [nzSpan]="24" nzRequired>${name}</nz-form-label>
            <nz-form-control [nzSpan]="24" nzValidatingTip="Validating...">
                {INPUT_REPLACEMENT}
            </nz-form-control>
        </nz-form-item>`;
    let inputReplacement = '';
    switch (inputType) {
        case 'text': {
            inputReplacement = `<input nz-input formControlName="${field}" placeholder="Nhập ${name.toLowerCase()}" nzSize="large"/>`;
            break;
        }
        case 'number': {
            inputReplacement = `<input nz-input formControlName="${field}" placeholder="Nhập ${name.toLowerCase()}" nzSize="large" type="number"/>`;
            break;
        }
        case 'date-picker': {
            inputReplacement = `<nz-date-picker formControlName="${field}"></nz-date-picker>`;
            break;
        }
        case 'select': {
            inputReplacement = `
                <nz-select formControlName="${field}" nzSize="large" nzPlaceHolder="Chọn ${name.toLowerCase()}">
${inputMapping.map(({value, display}) => (`                    <nz-option nzValue="${value}" nzLabel="${display}"></nz-option>`)).join('\n')}
                </nz-select>`;
            break;
        }
        case 'radio': {
            inputReplacement = `
                <nz-radio-group formControlName="${field}">
${inputMapping.map(({value, display}) => (`                    <label nz-radio nzValue="${value}">${display}</label>`)).join('\n')}
                </nz-radio-group>`;
            break;
        }
        case 'checkbox': {
            itemTemplate = `        <nz-form-item>
            <nz-form-control [nzSpan]="24" nzValidatingTip="Validating...">
                {INPUT_REPLACEMENT}
            </nz-form-control>
        </nz-form-item>`;
            inputReplacement = `<label nz-checkbox formControlName="${field}">${name}</label>`;
            break;
        }
                
        default:
            break;
    }
    return itemTemplate.replace('{INPUT_REPLACEMENT}', inputReplacement.trim());
}

function buildFormControlFromPropertyConfig(prop) {
    const formControl = `    ${prop.field}: new FormControl(null, {
      validators: [Validators.required],
    })`
    return formControl;
}

function bindIdParam(uri) {
    return uri.replace(/:id/gi, '${req.id}');
}
function buildListValueMappings(featureConfig) {
    const { feature, properties, workspace, featureGroup, name: featureName, apiUri } = featureConfig;
    const listPropertiesCreateRequest = [];
    const listTableHeaders = [];
    const listTableDataRows = [];
    const createFormGroup = [];
    const listItemsFormCreateItem = [];
    properties.forEach(prop => {
        listPropertiesCreateRequest.push(`    ${prop.field}: ${prop.dataType};`);
        listTableHeaders.push(`                <th>${prop.name}</th>`);
        listTableDataRows.push(`                <td>data.${prop.field}</td>`);
        createFormGroup.push(buildFormControlFromPropertyConfig(prop));
        listItemsFormCreateItem.push(buildFormItemFromPropertyConfig(prop));
    });
    const listPropertiesEntity = ['    id: number;', ...listPropertiesCreateRequest];
    const listValueMappings = [
        ['${workspace}', workspace],
        ['${featureGroup}', featureGroup],
        ['${feature}', feature],
        ['${featureName}', featureName],
        ['${featureNameLowerCase}', featureName.toLowerCase()],
        ['${entityName}', kebabToPascal(feature)],
        // API 
        ['${apiUri.getList}', bindIdParam(apiUri.getList)],
        ['${apiUri.create}', bindIdParam(apiUri.create)],
        ['${apiUri.update}', bindIdParam(apiUri.update)],
        ['${apiUri.lock}', bindIdParam(apiUri.lock)],
        ['${apiUri.delete}', bindIdParam(apiUri.delete)],
        // Entity and Object
        ['${listPropertiesEntity}', listPropertiesEntity.join('\n')],
        ['${listPropertiesCreateRequest}', listPropertiesCreateRequest.join('\n')],
        // Table and Form create update
        ['${listTableHeaders}', listTableHeaders.join('\n')],
        ['${listTableDataRows}', listTableDataRows.join('\n')],
        ['${createFormGroup}', createFormGroup.join(',\n')],
        ['${updateFormGroup}', createFormGroup.join(',\n')],
        ['${listItemsFormCreateItem}', listItemsFormCreateItem.join('\n')],
        ['${listItemsFormUpdateItem}', listItemsFormCreateItem.join('\n')],
    ]
    return listValueMappings;
}

module.exports = {
    buildListValueMappings
}