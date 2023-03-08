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
const devPort = "3000"

const getEnvVars = (envVars) => {
  const vars = { ...envVars, LOCALE_VERSION: new Date().getTime() };
  return JSON.stringify(vars);
};
const defaultChunkLimit = 100;
const distDir = path.join(__dirname, "build");
const publicDir = path.join(__dirname, "src");

const config = {
  entry: "./src/index.js",
  output: {
    path: distDir,
    filename: "[name].js",
    sourceMapFilename: "[name].js.map",
    chunkFilename: "[id].[chunkhash].js",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  devServer: {
    open: true,
    host: "localhost",
    static: {
      directory: publicDir
    },
    hot: true,
    port: devPort,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new InterpolateHtmlPlugin({
      JENKINS_JOB_NAME: process.env.JOB_NAME || 'Customer-center-Frontend',
      JENKINS_BUILD_NUMBER: process.env.BUILD_NUMBER || '0000',
      JENKINS_BUILD_TAG: process.env.BUILD_TAG || '0000',
      JENKINS_NODE_NAME: process.env.NODE_NAME || '0000',
      JENKINS_BUILD_ID: process.env.BUILD_ID || '0000',
    }),
    new webpack.DefinePlugin({
      "process.env": getEnvVars(dotenv.config({ path: envDir }).parsed),
    }),
    new CopyPlugin({ patterns: [{ from: "public", to: "." }, { from: "src/react/images", to: "react/images" }] }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: !isProduction ? "[name].css" : "[name].[hash].css",
      chunkFilename: !isProduction ? "[id].css" : "[id].[hash].css",
    }),
  ].filter((i) => i),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(css|scss)$/,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|otf|woff|woff2|png|jpg|jpeg|gif)$/i,
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
