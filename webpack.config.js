// Generated using webpack-cli https://github.com/webpack/webpack-cli

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const envDir = path.join(__dirname, "/.env");
const isProduction = process.env.NODE_ENV == "production";
const dotenv = require("dotenv");
const stylesHandler = "style-loader";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const getEnvVars = (envVars) => {
  const vars = { ...envVars, LOCALE_VERSION: new Date().getTime() };
  return JSON.stringify(vars);
};
const defaultChunkLimit = 100;
const distDir = path.join(__dirname, "build");

// console.log('This is the result: ', getEnvVars(dotenv.config({ path: envDir }).parsed));
const config = {
  // entry:{
  //   reactApp: './src/index.js',
  //   navMenu: './src/App.js',
  //   sideNavMenu: './src/indexSideNavMenu.js',
  //   moreTools: './src/moreTools.js',
  //   myHealthPage: './src/components/myHealth/myHealthPage.js',
  //   preferredContactInfo: './src/preferredContactInfo.js'
  // },
  entry: "./src/index.js",
  output: {
    path: distDir,
    filename: "[name].js",
    sourceMapFilename: "[name].js.map",
    chunkFilename: "[id].[chunkhash].js",
  },
  devServer: {
    open: true,
    host: "localhost",
    static: {
      directory: path.join(__dirname, "build"),
    },
    hot: true,
    port: "3000",
  },
  plugins: [
    new InterpolateHtmlPlugin({
      JENKINS_JOB_NAME: process.env.JOB_NAME || 'Customer-center-Frontend',
      JENKINS_BUILD_NUMBER: process.env.BUILD_NUMBER || '0000',
      JENKINS_BUILD_TAG: process.env.BUILD_TAG || '0000',
      JENKINS_NODE_NAME: process.env.NODE_NAME || '0000',
      JENKINS_BUILD_ID: process.env.BUILD_ID || '0000',
    }),
    // new HtmlWebpackPlugin({
    //   template: "./public/index.html",
    //   filename: "./build/index.html",
    // }),
    new webpack.DefinePlugin({
      "process.env": getEnvVars(dotenv.config({ path: envDir }).parsed),
    }),
    new CopyPlugin({ patterns: [{ from: "public", to: "." }] }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: !isProduction ? "[name].css" : "[name].[hash].css",
      chunkFilename: !isProduction ? "[id].css" : "[id].[hash].css",
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      // maxChunks: !isProduction ? 1 : defaultChunkLimit,
      maxChunks: defaultChunkLimit,
    }),
  ].filter((i) => i),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(css|scss)$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
