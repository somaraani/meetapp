/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
 const path = require('path');
 const extraNodeModules = {
   '@types': path.resolve(__dirname + '/../shared/types.ts')
 };
 const watchFolders = [
   path.resolve(__dirname + '/../shared')
 ];
 module.exports = {
   transformer: {
     getTransformOptions: async () => ({
       transform: {
         experimentalImportSupport: false,
         inlineRequires: false,
       },
     }),
   }, 
   resolver: {
     extraNodeModules
   },
   watchFolders,
 };