const path = require('path');
const package = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

const webpack = require('webpack');

require('dotenv').config();

module.exports = (env, options) => {

  const build = options.mode === 'production';
  const version = package.version

  let https = true
  if (process.env.HTTPS_KEY) {
    https = {
      key: fs.readFileSync(process.env.HTTPS_KEY),
      cert: fs.readFileSync(process.env.HTTPS_CERT)
    }
  }
  return {
    entry: {
      app: './frontend/src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: `wf-school-map-utility.${version}.js`,
      library: 'wfSchoolMap',
      libraryTarget: 'umd',
      globalObject: 'this',
      umdNamedDefine: true
    },
    devServer: {
      host: 'localhost',
      port: 3001,
      open: false,
      https: https,
      historyApiFallback: {
        index: `/index.${version}.html`
      },
      static: path.resolve(__dirname, 'frontend', 'public')
    },
    devtool: build ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          include: /frontend/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader', // compiles SCSS to CSS
            }
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: /frontend/,
          use: {
            loader: 'babel-loader'
          },
        },
        {
          test: /\.css$/i,
          include: /frontend/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.svg$/,
          include: /frontend/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          include: path.resolve(__dirname, './node_modules/bootstrap-icons/icons'),
          use: ['@svgr/webpack'],
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.DefinePlugin({
        'process.env.MAPBOX_ACCESS_TOKEN': JSON.stringify(process.env.MAPBOX_ACCESS_TOKEN),
        'process.env.WF_SCHOOL_MAP_API': JSON.stringify(process.env.WF_SCHOOL_MAP_API)
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'frontend', 'public', 'index.ejs'),
        inject: true,
        filename: path.join(__dirname, 'dist', `index.${version}.html`),
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
            output: {comments: false}
          }
        })
      ]
    },
    // resolve: {
    //   fallback: {
    //     util: require.resolve("util/")
    //   }
    // }
  };
};
