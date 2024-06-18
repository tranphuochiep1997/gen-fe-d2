function genFeatureGroupCommand(featureGroup) {
    return `npx nx generate @vts-kit/nx-angular:feature-group --name=${featureGroup} --no-interactive`;
}

function genFeatureCommand(featureGroup, feature) {
    return `npx nx generate @vts-kit/nx-angular:component --name=${feature} --project=${featureGroup}-feature --no-interactive`;
}

function genServiceCommand(featureGroup, feature) {
    return `npx nx generate @vts-kit/nx-angular:service --name=${feature} --project=${featureGroup}-data-access --no-interactive`;
}

function genComponentStoreCommand(featureGroup, feature) {
    return `npx nx generate @vts-kit/nx-angular:component-store --name=${feature} --project=${featureGroup}-data-access --no-interactive`;
}

function genClassEntityCommand(featureGroup, feature) {
    return `npx nx generate @vts-kit/nx-angular:class --name=${feature} --project=${featureGroup}-data-access --no-interactive`;
}

function genUICreateItemCommand(featureGroup, feature) {
    return `npx nx generate @vts-kit/nx-angular:component --name=${feature}-modal-create-item --project=${featureGroup}-ui --no-interactive`;
}

function genUIUpdateItemCommand(featureGroup, feature) {
    return `npx nx generate @vts-kit/nx-angular:component --name=${feature}-modal-update-item --project=${featureGroup}-ui --no-interactive`;
}

const commandOptions = {stdio: 'inherit', encoding: 'utf-8'};

module.exports = {
    genFeatureGroupCommand,
    genFeatureCommand,
    genServiceCommand,
    genComponentStoreCommand,
    genClassEntityCommand,
    genUICreateItemCommand,
    genUIUpdateItemCommand,
    commandOptions
}