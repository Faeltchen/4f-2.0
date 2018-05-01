const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var spawn = require('child_process').spawn;
spawn('node', ['./src/server.js']);

module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('Production: ', env.production) // true

  return {
    entry: [
      'react-hot-loader/patch',
      './src/index.js'
    ],
    output: {
      //filename: 'bundle.js'
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.scss$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000'
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        modals: path.resolve(__dirname, 'src/modals/'),
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.production || 'development')
      }),
      new CleanWebpackPlugin(['dist']),

      new webpack.optimize.AggressiveMergingPlugin({
          minSizeReduce: 2,
          moveToParents: true,
      }),

      /*
      new webpack.optimize.AggressiveSplittingPlugin({
          minSize: 10000,
          maxSize: 30000,
      }),
      */
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
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
    devtool: 'source-map',
    watch: true,
  }
}
