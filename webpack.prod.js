const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = merge(common, {
    mode: 'production',
    plugins: [
      new BundleAnalyzerPlugin()
      
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