const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtracPlugin = require('mini-css-extract-plugin')
const OfflinePackageWebpackPlugin = require("offline-package-webpack-plugin")

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
    new OfflinePackageWebpackPlugin({
      packageNameKey: 'packageId',
      // TODO: 上传安装包时, 应该对这个packageId进行检查, 和线上module_name保持一直才行
      packageNameValue: 'meeting',
      version: 1,
      baseUrl: "http://10.2.155.99/",
      fileTypes: ['js', 'css', 'png']
    }),
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
