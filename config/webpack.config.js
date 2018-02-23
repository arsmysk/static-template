const webpack = require('webpack')
const {globEntries} = require('../bin/util')
const path = require('path')

const cwd = process.cwd()
const dev = process.env.NODE_ENV === 'development'

const commonPlugins = [
  // https://vuejs.org/v2/guide/deployment.html
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: `"${process.env.NODE_ENV}"` || '"development"'
    }
  }),
]
const productionPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    test: /\.js($|\?)/i,
    sourceMap: false
  })
]
const usingPlugins = process.env.NODE_ENV === 'development' ? commonPlugins :
  [...commonPlugins,
    ...productionPlugins
  ]

module.exports = {
  entry: globEntries(path.join(cwd, 'src/assets/script/[!_]*.js')),
  output: {
    filename: `[name].js`,
    path: path.join(cwd, 'dist/assets/script/')
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: dev ? 'inline-source-map' : false,
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      path.join(cwd, 'src/assets/script'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: usingPlugins,
}