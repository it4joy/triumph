'use strict';

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    library: 'main',
  },
  devtool: NODE_ENV == 'development' ? 'source-map' : null,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }, {
        // remove 'node_modules' from resulting path (optional)
        test: /\.(png|jpg|jpeg|gif|svg|ttf|otf|eot|woff|woff2)$/,
        include: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'name=[1].[ext]&regExp=node_modules/(.*)'
            }
          }
        ]
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|ttf|otf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            }
          }
        ]
      },
    ]
  },
  // need in 'resolve' & 'resolveLoader'?

  plugins: [
    new MiniCssExtractPlugin({
      filename: NODE_ENV == 'development' ? '[name].css' : '[name].[hash].css',
      chunkFilename: NODE_ENV == 'development' ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
};
