const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the project root (mobile app directory)
const projectRoot = __dirname;
// Get the monorepo root
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Map workspace packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Handle workspace protocol
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@football-tracker/')) {
    const packageName = moduleName.split('/')[1];
    const packagePath = path.resolve(workspaceRoot, 'packages', packageName);
    
    if (packageName === 'shared') {
      return {
        type: 'sourceFile',
        filePath: path.resolve(packagePath, 'src/index.ts'),
      };
    }
  }
  
  // Use default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
