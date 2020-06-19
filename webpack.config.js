const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const ExtensionReloader = require('webpack-extension-reloader');
// const process = require('process')

// where is the entry file

// const isDev = process.env.NODE_ENV === 'development';
module.exports = {

  mode: 'development',
  entry: {

    popup: path.resolve(__dirname, `src/popup/popup.ts`),
    options: path.resolve(__dirname, `src/options/options.ts`),
    content: path.resolve(__dirname, `src/content/content.ts`),
    background: path.resolve(__dirname, `src/background/background.ts`)
    // load popupscript
  },
  output: {

    path: path.resolve(__dirname, 'dist'),
    filename: "[name]/[name].js"
    // might change this
  },




  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },

      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]

      },

      // web worker

      // {
      //   test: /\.worker\.js$/,
      //   use: {
      //     loader: 'worker-loader',
      //     options: { inline: true }
      //     // options: {
      //     //   inline: true
      //     // }
      //   }
      // },

      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },

  plugins: [

    // new ExtensionReloader({
    //   manifest: path.resolve(__dirname, "manifest.json")
    // }),

    new HtmlWebpackPlugin({
      title: "Popup",
      filename: path.resolve(__dirname, `dist/popup/popup.html`),
      template: `src/popup/popup.html`,
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      title: "Options",
      filename: path.resolve(__dirname, `dist/options/options.html`),
      template: `src/options/options.html`,
      chunks: ["options"]
    }),

    new CopyPlugin([
      // {from: 'public', to: 'public'}, 
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'src/icons', to: 'icons' },
      { from: 'src/content/content.css', to: 'content/content.css' }
      // {from: 'src/content.css', to: 'content.css'},
      // {from: 'src/ball-clip-rotate.min.css', to: 'ball-clip-rotate.min.css'} 
      // {from: 'progressbar.min.js', to: 'progressbar.min.js'}
    ])
    // new CleanWebpackPlugin()
    // new CopyWebpackPlugin(), 
    // new HtmlWebPackPlugin({
    //     template: "./index.html",

    //   })





    // new ErrorOverlayPlugin()
  ],

  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
    alias: {
      src: path.resolve(__dirname, "src/")
    }

  }
};

// if (isDev) {
//   module.exports.plugins.push()
// }