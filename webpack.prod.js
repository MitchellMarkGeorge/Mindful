const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const path = require('path');
module.exports = merge(common, {
    mode: 'production',
  
    plugins: [
      new CleanWebpackPlugin(),

      // new BundleAnalyzerPlugin()
      // new ZipPlugin({
      //   path: path.resolve(__dirname),
      //   filename: 'bundle',
      //   fileOptions: {
      //     mtime: new Date(),
      //     mode: 0o100664,
      //     compress: true,
      //     forceZip64Format: false
      //   },
      //   zipOptions: {
      //     forceZip64Format: false
      //   }
      // })
      
    ],
    optimization: {
        minimizer: [
          new TerserPlugin({
            
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ],
      },
  });