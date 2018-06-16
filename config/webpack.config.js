const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const {globWebpackEntries} = require('../bin/util')
const path = require('path')
const config = require('./index')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const cwd = process.cwd()
const dev = process.env.NODE_ENV === 'development'

const commonPlugins = [
  // https://vuejs.org/v2/guide/deployment.html
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: `"${process.env.NODE_ENV}"` || '"development"',
    },
  }),
  // https://github.com/mrsteele/dotenv-webpack
  new Dotenv({
    path: dev
      ? path.join(cwd, '.development.env')
      : path.join(cwd, '.production.env'),
  }),
  new VueLoaderPlugin(),
]
const productionPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    test: /\.js($|\?)/i,
    sourceMap: false,
  }),
]
const usingPlugins =
  process.env.NODE_ENV === 'development'
    ? commonPlugins
    : [...commonPlugins, ...productionPlugins]

module.exports = {
  entry: globWebpackEntries(path.join(cwd, 'src/assets/script/[!_]*.js')),
  output: {
    filename: `[name].js`,
    path: path.join(cwd, 'dist/assets/script/'),
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: dev ? 'inline-source-map' : false,
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [path.join(cwd, 'src/assets/script'), 'node_modules'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: {
          loader: 'vue-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(process.cwd(), config.src),
                path.resolve(process.cwd(), 'node_modules'),
              ],
            },
          },
          {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
              plugins: [require('autoprefixer')()],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: file =>
          // https://vue-loader.vuejs.org/migrating.html#importing-sfcs-from-dependencies
          /node_modules/.test(file) && !/\.vue\.js/.test(file),
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: usingPlugins,
}
