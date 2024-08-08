const { kebabToPascalCase, camelToUpperSnakeCase } = require('./string-util');
const { shouldPropertyUseConstantVariable } = require('./validator-util');

function buildFormItemFromPropertyConfig(property) {
    const { name, field, inputType } = property;
    let itemTemplate = `        <nz-form-item>
            <nz-form-label [nzSpan]="24" nzRequired>${name}</nz-form-label>
            <nz-form-control [nzSpan]="24" nzErrorTip="{ERROR_TIP_REPLACEMENT}">
                {INPUT_REPLACEMENT}
            </nz-form-control>
        </nz-form-item>`;
    let inputReplacement = '';
    let nzErrorTip = `Vui lòng nhập ${name.toLowerCase()}`;
    switch (inputType) {
        case 'text': {
            inputReplacement = `<v-input [type]="text" formControlName="${field}" [placeholder]="Nhập ${name.toLowerCase()}" [maxlength]="255"/>`;
            break;
        }
        case 'number': {
            inputReplacement = `<v-input [type]="number" formControlName="${field}" [placeholder]="Nhập ${name.toLowerCase()}" [maxlength]="255">`;
            break;
        }
        case 'date-picker': {
            nzErrorTip = `Vui lòng lựa chọn ${name.toLowerCase()}`;
            inputReplacement = `<nz-date-picker formControlName="${field}"></nz-date-picker>`;
            break;
        }
        case 'textarea': {
            inputReplacement = `<v-text-area formControlName="${field}" [rows]="4" placeholder="Nhập ${name.toLowerCase()}" [maxlength]="255"></v-text-area>`;
                // <nz-textarea-count [nzMaxCharacterCount]="2000">
                //     <textarea formControlName="${field}" nz-input rows="4" placeholder="Nhập ${name.toLowerCase()}"></textarea>
                // </nz-textarea-count>`;
            break;
        }
        case 'select': {
            nzErrorTip = `Vui lòng lựa chọn ${name.toLowerCase()}`;
            const inputMappingVariable = camelToUpperSnakeCase(field);
            inputReplacement = `
                <nz-select formControlName="${field}" nzSize="large" nzPlaceHolder="Chọn ${name.toLowerCase()}">
                    <nz-option *ngFor="let item of ${inputMappingVariable}" nzValue="{{item.value}}" nzLabel="{{item.display}}"></nz-option>
                </nz-select>`;
                // ${inputMapping.map(({value, display}) => (`                    <nz-option nzValue="${value}" nzLabel="${display}"></nz-option>`)).join('\n')}
            break;
        }
        case 'radio': {
            nzErrorTip = `Vui lòng lựa chọn ${name.toLowerCase()}`;
            const inputMappingVariable = camelToUpperSnakeCase(field);
            inputReplacement = `
                <nz-radio-group formControlName="${field}">
                    <label *ngFor="let item of ${inputMappingVariable}" nz-radio nzValue="{{item.value}}">{{item.display}}</label>
                </nz-radio-group>`;
                // ${inputMapping.map(({value, display}) => (`                    <label nz-radio nzValue="${value}">${display}</label>`)).join('\n')}
            break;
        }
        case 'checkbox': {
            nzErrorTip = `Vui lòng lựa chọn ${name.toLowerCase()}`;
            itemTemplate = `        <nz-form-item>
            <nz-form-control [nzSpan]="24" nzErrorTip="{ERROR_TIP_REPLACEMENT}">
                {INPUT_REPLACEMENT}
            </nz-form-control>
        </nz-form-item>`;
            inputReplacement = `<label nz-checkbox formControlName="${field}">${name}</label>`;
            break;
        }
                
        default:
            break;
    }
    return itemTemplate.replace('{ERROR_TIP_REPLACEMENT}', nzErrorTip.trim()).replace('{INPUT_REPLACEMENT}', inputReplacement.trim());
}

function buildFormControlFromPropertyConfig(prop) {
    const formControl = `    ${prop.field}: new FormControl<${prop.dataType} | null>(null, {
      validators: [Validators.required],
    })`
    return formControl;
}

function bindIdParam(uri, replacement) {
    return uri.replace(/:id/gi, replacement);
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
        ['${apiUri.getList}', bindIdParam(apiUri.getList, '${req.id}')],
        ['${apiUri.getDetail}', bindIdParam(apiUri.getDetail, '${id}')],
        ['${apiUri.create}', bindIdParam(apiUri.create, '${req.id}')],
        ['${apiUri.update}', bindIdParam(apiUri.update, '${req.id}')],
        ['${apiUri.lock}', bindIdParam(apiUri.lock, '${req.id}')],
        ['${apiUri.delete}', bindIdParam(apiUri.delete, '${req.id}')],
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