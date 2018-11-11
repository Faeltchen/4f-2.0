const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const express = require('express')

var spawn = require('child_process').spawn;
//spawn('node', ['./src/StaticServer.js']);
//spawn('node', ['./src/APIServer.js']);

module.exports = merge(common, {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
  devServer: {
    contentBase: './dist',
    disableHostCheck: true,   // That solved it
    historyApiFallback: true,
    hot: true,
    stats: {
      warnings: false
    },
    setup: function(app) {
      app.use('/uploads', express.static('./uploads'));
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        API_PORT: 443,
        NODE_ENV: JSON.stringify('development')
      }
     }),
  ],
});
