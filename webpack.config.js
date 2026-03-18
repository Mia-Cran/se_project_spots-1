const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './scripts/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader','postcss-loader'],
      },
      {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  },
},
   {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
],
},
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    favicon: './src/images/favicon.ico'
  })
]
};