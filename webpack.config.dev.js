const path = require('path');

module.exports = {
  entry: './src/js/picker.js',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'picker.js'
  },
  watch:true,
  devServer: {
        contentBase: path.join(__dirname, "dist/"),
        port: 9000
  },
  module: {
    rules: [
      {
         test:/\.(s*)css$/,
         use:['style-loader','css-loader', 'sass-loader']
      },
      {
        test: /\.svg/,
        use: [
          { loader: 'svg-inline-loader' },
        ]
      }
    ]
  }
};
