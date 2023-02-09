// Generated using webpack-cli https://github.com/webpack/webpack-cli

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const envDir = path.join(__dirname, "/.env");
const isProduction = process.env.NODE_ENV == "production";
const dotenv = require("dotenv");
const stylesHandler = "style-loader";

const getEnvVars = (envVars) => {
  const vars = { ...envVars, LOCALE_VERSION: new Date().getTime() };
  return JSON.stringify(vars);
};

// console.log('This is the result: ', getEnvVars(dotenv.config({ path: envDir }).parsed));
const config = {
  entry:{
    reactApp: './src/index.js',
    navMenu: './src/App.js',
    sideNavMenu: './src/indexSideNavMenu.js',
    moreTools: './src/moreTools.js',
    myHealthPage: './src/components/myHealth/myHealthPage.js',
    preferredContactInfo: './src/preferredContactInfo.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: "3000",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env": getEnvVars(dotenv.config({ path: envDir }).parsed),
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
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
