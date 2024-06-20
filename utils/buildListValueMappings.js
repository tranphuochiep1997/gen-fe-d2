const { kebabToPascalCase, camelToUpperSnakeCase } = require('./string-util');
const { shouldPropertyUseConstantVariable } = require('./validator-util');

function buildFormItemFromPropertyConfig(property) {
    const { name, field, inputType } = property;
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
            const inputMappingVariable = camelToUpperSnakeCase(field);
            inputReplacement = `
                <nz-select formControlName="${field}" nzSize="large" nzPlaceHolder="Chọn ${name.toLowerCase()}">
                    <nz-option *ngFor="let item of ${inputMappingVariable}" nzValue="{{item.value}}" nzLabel="{{item.display}}"></nz-option>
                </nz-select>`;
                // ${inputMapping.map(({value, display}) => (`                    <nz-option nzValue="${value}" nzLabel="${display}"></nz-option>`)).join('\n')}
            break;
        }
        case 'radio': {
            const inputMappingVariable = camelToUpperSnakeCase(field);
            inputReplacement = `
                <nz-radio-group formControlName="${field}">
                    <label *ngFor="let item of ${inputMappingVariable}" nz-radio nzValue="{{item.value}}">{{item.display}}</label>
                </nz-radio-group>`;
                // ${inputMapping.map(({value, display}) => (`                    <label nz-radio nzValue="${value}">${display}</label>`)).join('\n')}
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
    const formControl = `    ${prop.field}: new FormControl<${prop.dataType} | null>(null, {
      validators: [Validators.required],
    })`
    return formControl;
}

function bindIdParam(uri) {
    return uri.replace(/:id/gi, '${req.id}');
}

function genFeatureGroupBreadcumsReplacement(breadcrumbs) {
    let breadcrumbsString = '';
    if (breadcrumbs && breadcrumbs.length > 0) {
        breadcrumbsString = breadcrumbs.map(b => `'${b}', `).join('');
    }
    return breadcrumbsString;
}

function genImportConstantVariableStr(listConstantVariableUsed, workspace, featureGroup) {
    if (listConstantVariableUsed.length < 1) return '';
    return `import { 
${listConstantVariableUsed.map(variable => `  ${variable},`).join('\n')}
} from "@${workspace}/${featureGroup}/data-access";\n`;
}

function genImportConstantVariablePropertiesSet(listConstantVariableUsed) {
    if (listConstantVariableUsed.length < 1) return '';
    return listConstantVariableUsed.map(variable => `  readonly ${variable} = ${variable};\n`).join('')
}

function buildListValueMappings(featureConfig) {
    const { feature, properties, workspace, featureGroup, featureGroupBreadcrumbs, name: featureName, apiUri } = featureConfig;
    const featureGroupBreadcrumbsReplacement = genFeatureGroupBreadcumsReplacement(featureGroupBreadcrumbs);
    const listPropertiesCreateRequest = [];
    const listTableHeaders = [];
    const listTableDataRows = [];
    const createFormGroup = [];
    const listItemsFormCreateItem = [];
    const listConstantVariableUsed = [];
    properties.forEach(prop => {
        listPropertiesCreateRequest.push(`    ${prop.field}: ${prop.dataType} | null;`);
        listTableHeaders.push(`                <th>${prop.name}</th>`);
        listTableDataRows.push(`                <td>{{data.${prop.field}}}</td>`);
        createFormGroup.push(buildFormControlFromPropertyConfig(prop));
        listItemsFormCreateItem.push(buildFormItemFromPropertyConfig(prop));
        if (shouldPropertyUseConstantVariable(prop)) {
            listConstantVariableUsed.push(camelToUpperSnakeCase(prop.field));
        }
    });
    const listPropertiesEntity = ['    id: number;', ...listPropertiesCreateRequest];
    const constantVariableImport = genImportConstantVariableStr(listConstantVariableUsed, workspace, featureGroup);
    const constantVariablePropertiesSet = genImportConstantVariablePropertiesSet(listConstantVariableUsed);
    const listValueMappings = [
        ['${workspace}', workspace],
        ['${featureGroup}', featureGroup],
        ['${featureGroupBreadcrumbs}', featureGroupBreadcrumbsReplacement],
        ['${feature}', feature],
        ['${featureName}', featureName],
        ['${featureNameLowerCase}', featureName.toLowerCase()],
        ['${entityName}', kebabToPascalCase(feature)],
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
        // Constant variables
        ['${constantVariableImport}', constantVariableImport],
        ['${constantVariablePropertiesSet}', constantVariablePropertiesSet]
    ]
    return listValueMappings;
}

module.exports = {
    buildListValueMappings
}