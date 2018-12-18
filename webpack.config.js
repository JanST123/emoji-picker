const path = require('path');

module.exports = {
  entry: './src/js/picker.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'picker.js'
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
