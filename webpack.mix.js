const mix = require('laravel-mix');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.copy('src/assets/images', 'public/react/images')

mix.options({
   terser: {
     extractComments: false,
   }
 });

mix.webpackConfig({
   context: __dirname,
   entry: {
      reactApp: './src/index.js',
      navMenu: './src/App.js',
      sideNavMenu: './src/indexSideNavMenu.js',
      moreTools: './src/moreTools.js',
      myHealthPage: './src/components/myHealth/myHealthPage.js',
      preferredContactInfo: './src/preferredContactInfo.js'
    },
    target: 'web',
    devServer: {
      port: '5000',
      static: {
        directory: path.join(__dirname, 'public')
  },
      open: true,
      hot: true,
      liveReload: true,
    },
   output: {
      path: path.resolve(__dirname, 'public/react'),
      filename: '[name].js',
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            use: 'babel-loader',
         }
      ]
   }
});
