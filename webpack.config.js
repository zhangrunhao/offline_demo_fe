const HtmlWebPackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtracPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    },
    {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtracPlugin.loader,
        'css-loader'
      ]
    }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtracPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
