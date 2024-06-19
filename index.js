#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const {
  genFeatureGroupCommand,
  genFeatureCommand,
  genServiceCommand,
  genComponentStoreCommand,
  genClassEntityCommand,
  commandOptions,
  genUICreateItemCommand,
  genUIUpdateItemCommand
} = require('./utils/command-util');

const {
  generateAllFilesContentForFeature
} = require('./utils/gen-components');

const gencodeJson = fs.readFileSync('./gencode.json', { encoding: 'utf8', flag: 'r' });
const gencodeConfig = JSON.parse(gencodeJson);
const { workspace, listFeatureGroups } = gencodeConfig
console.log(gencodeJson);

listFeatureGroups.forEach(group => {
  const { featureGroup, featureGroupExistAlready, listFeatures } = group;
  console.log('GENERATING FEATURE GROUP ' + featureGroup);
  // GENERATE FEATURE GROUP
  if (!featureGroupExistAlready) {
    execSync(genFeatureGroupCommand(featureGroup), commandOptions);
  }
  // GENERATE LIST FEATURE
  listFeatures.forEach(featureConfig => {
    const { feature, name } = featureConfig;
    // GENERATE FEATURE
    execSync(genFeatureCommand(featureGroup, feature), commandOptions);
    // GENERATE SERVICE
    execSync(genServiceCommand(featureGroup, feature), commandOptions);
    // GENERATE COMPONENT STORE
    execSync(genComponentStoreCommand(featureGroup, feature), commandOptions);
    // GENERATE UI MODAL CREATE ITEM
    execSync(genUICreateItemCommand(featureGroup, feature), commandOptions);
    // GENERATE UI MODAL UPDATE ITEM
    execSync(genUIUpdateItemCommand(featureGroup, feature), commandOptions);
  });
  const featureGroupAbsFolder = path.join(`./libs/${featureGroup}`);
  // WARN: Câu lệnh genClassEntityCommand này mà đem lên vòng for trên thì nó lỗi
  listFeatures.forEach(featureConfig => {
    const { feature, name } = featureConfig;
    const featureDataAccessFolder = `${featureGroupAbsFolder}/data-access/src/lib/${feature}`;
    // fs.mkdirSync(modelsFolder, { recursive: true });
    // GENRATE CLASS ENTITY
    execSync(genClassEntityCommand(featureGroup, feature), {cwd: featureDataAccessFolder, ...commandOptions});
    generateAllFilesContentForFeature(featureGroupAbsFolder, {...featureConfig, workspace, featureGroup});
  });
})