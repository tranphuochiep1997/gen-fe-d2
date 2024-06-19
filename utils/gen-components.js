const path = require('path');
const { genFileContentFromTemplate, writeContentToFile, appendContentToFile } = require('./genFileContentFromTemplate');
const { buildListValueMappings } = require('./buildListValueMappings');
const { shouldPropertyUseConstantVariable } = require('./validator-util');

const entityTemplateFile = path.resolve(__dirname, '../templates/entity-component/index.template');
function genEntityContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(entityTemplateFile, destinationFilePath, listValueMappings);
}

const serviceTemplateFile = path.resolve(__dirname, '../templates/service-component/index.template');
function genServiceContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(serviceTemplateFile, destinationFilePath, listValueMappings);
}

const storeTemplateFile = path.resolve(__dirname, '../templates/store-component/index.template');
function genStoreContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(storeTemplateFile, destinationFilePath, listValueMappings);
}

const tableComponentTsTemplateFile = path.resolve(__dirname, '../templates/table-component/index.ts.template');
function genTableTsContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(tableComponentTsTemplateFile, destinationFilePath, listValueMappings);
}

const tableComponentHtmlTemplateFile = path.resolve(__dirname, '../templates/table-component/index.html.template');
function genTableHtmlContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(tableComponentHtmlTemplateFile, destinationFilePath, listValueMappings);
}

const modalCreateItemTsTemplateFile = path.resolve(__dirname, '../templates/create-component/index.ts.template');
function genModalCreateItemTsContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(modalCreateItemTsTemplateFile, destinationFilePath, listValueMappings);
}

const modalCreateItemHtmlTemplateFile = path.resolve(__dirname, '../templates/create-component/index.html.template');
function genModalCreateItemHtmlContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(modalCreateItemHtmlTemplateFile, destinationFilePath, listValueMappings);
}

const modalUpdateItemTsTemplateFile = path.resolve(__dirname, '../templates/update-component/index.ts.template');
function genModalUpdateItemTsContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(modalUpdateItemTsTemplateFile, destinationFilePath, listValueMappings);
}

const modalUpdateItemHtmlTemplateFile = path.resolve(__dirname, '../templates/update-component/index.html.template');
function genModalUpdateItemHtmlContent(destinationFilePath, listValueMappings) {
    genFileContentFromTemplate(modalUpdateItemHtmlTemplateFile, destinationFilePath, listValueMappings);
}

const deplayInputMapping = [{ value: 'value1', display: 'display1' }];
function genConstantVariables(destinationFilePath, moduleExportFilePath, featureConfig) {
    const { feature, properties } = featureConfig;
    const propertiesWithValueMapping = properties
        .filter(prop => shouldPropertyUseConstantVariable(prop))
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
    writeContentToFile(destinationFilePath, fileContent);
    //Append export file
    const exportRow = `\nexport * from './lib/${feature}/${feature}.constant';`;
    appendContentToFile(moduleExportFilePath, exportRow);
}

function generateAllFilesContentForFeature(featureGroupFolder, featureConfig) {
    const { feature } = featureConfig;
    const listValueMappings = buildListValueMappings(featureConfig);

    const featureDataAccessFolder = `${featureGroupFolder}/data-access/src/lib/${feature}`;
    // Constant variables 
    const constantFilePath = `${featureDataAccessFolder}/${feature}.constant.ts`;
    const moduleExportFilePath = `${featureGroupFolder}/data-access/src/lib/index.ts`;
    genConstantVariables(constantFilePath, moduleExportFilePath, featureConfig);

    // Entity, Service, Store handle
    const entityFilePath = `${featureDataAccessFolder}/${feature}.ts`;
    const serviceFilePath = `${featureDataAccessFolder}/${feature}.service.ts`;
    const storeFilePath = `${featureDataAccessFolder}/${feature}.store.ts`;
    genEntityContent(entityFilePath, listValueMappings);
    genServiceContent(serviceFilePath, listValueMappings);
    genStoreContent(storeFilePath, listValueMappings);
    // Screen Table, Create, Update, Delete handle
    const featureScreenFolder = `${featureGroupFolder}/feature/src/lib/${feature}`;
    const tableTsFilePath = `${featureScreenFolder}/${feature}.component.ts`;
    const tableHtmlFilePath = `${featureScreenFolder}/${feature}.component.html`;
    genTableTsContent(tableTsFilePath, listValueMappings);
    genTableHtmlContent(tableHtmlFilePath, listValueMappings);

    const uiModalCreateItemFolder = `${featureGroupFolder}/ui/src/lib/${feature}-modal-create-item`;
    const uiModalCreateItemTsFilePath = `${uiModalCreateItemFolder}/${feature}-modal-create-item.component.ts`;
    const uiModalCreateItemHtmlFilePath = `${uiModalCreateItemFolder}/${feature}-modal-create-item.component.html`;
    genModalCreateItemTsContent(uiModalCreateItemTsFilePath, listValueMappings);
    genModalCreateItemHtmlContent(uiModalCreateItemHtmlFilePath, listValueMappings);

    const uiModalUpdateItemFolder = `${featureGroupFolder}/ui/src/lib/${feature}-modal-update-item`;
    const uiModalUpdateItemTsFilePath = `${uiModalUpdateItemFolder}/${feature}-modal-update-item.component.ts`;
    const uiModalUpdateItemHtmlFilePath = `${uiModalUpdateItemFolder}/${feature}-modal-update-item.component.html`;
    genModalUpdateItemTsContent(uiModalUpdateItemTsFilePath, listValueMappings);
    genModalUpdateItemHtmlContent(uiModalUpdateItemHtmlFilePath, listValueMappings);
}

module.exports = {
    genEntityContent,
    genServiceContent,
    genStoreContent,
    genTableTsContent,
    generateAllFilesContentForFeature
}