const fs = require('fs');

function replaceTemplateContent(dataTemplate, listValueMappings) {
    let replacedContent = dataTemplate;
    listValueMappings.forEach(([key, value]) => {
        replacedContent = replacedContent.replaceAll(key, value);
    });
    return replacedContent;
}

function writeContentToFile(destinationFilePath, fileContent) {
    fs.writeFile(destinationFilePath, fileContent, (err) => {
        if (err) throw err;
        console.log(`Successfully update ${destinationFilePath}`);
    });
}

function appendContentToFile(destinationFilePath, appendContent) {
    fs.appendFile(destinationFilePath, appendContent, (err) => {
        if (err) throw err;
        console.log(`Successfully update ${destinationFilePath}`);
    });
}

function genFileContentFromTemplate(templateFilePath, destinationFilePath, listValueMappings) {
    // Read the template
    fs.readFile(templateFilePath, 'utf-8', (err, data) => {
        if (err) throw err;
        const fileContent = replaceTemplateContent(data, listValueMappings);
        writeContentToFile(destinationFilePath, fileContent);
    })
}

module.exports = {
    genFileContentFromTemplate,
    writeContentToFile,
    appendContentToFile
}