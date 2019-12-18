const path = require('path');


// where is the entry file
module.exports = {
    
    mode: 'development',
    entry: './src/app.js',
    output: {
      filename: 'bundle.js',
      path: __dirname,
    // might change this
    },
    

    

    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                  }
                
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]

            },

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
        // new CleanWebpackPlugin(), 
        // new HtmlWebPackPlugin({
        //     template: "./index.html",
            
        //   })

    



        // new ErrorOverlayPlugin()
    ],

    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts'],
        
      }
  };