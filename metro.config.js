const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.resolver = config.resolver || {};
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

config.resolver.alias = {
  '@officer':    path.resolve(projectRoot, 'src'),
  '@':           path.resolve(projectRoot, 'src'),
  '@geo':        path.resolve(projectRoot, 'packages/geo'),
};

config.resolver.blockList = [
  /server_dist\/.*/,
];

module.exports = config;
