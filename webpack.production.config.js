const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');

const productionConfig = {
  ...config,
  devtool: false,
  plugins: [],
  output: { ...config.output, filename: 'anchor-navigation-menu.js' },
  mode: 'production',
  optimization: {
    minimize: false
  }
};

const productionMinConfig = {
  ...config,
  devtool: false,
  plugins: [],
  output: { ...config.output, filename: 'anchor-navigation-menu.min.js' },
  mode: 'production',
  optimization: {
    minimize: true
  }
};

const productionDemoConfig = {
  ...productionMinConfig,
  plugins: config.plugins,
  output: { ...config.output, path: path.resolve(__dirname, 'demo') },
};

module.exports = [
  productionConfig, productionMinConfig, productionDemoConfig
];

