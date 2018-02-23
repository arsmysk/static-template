const {globEntries} = require('../bin/util')
const path = require('path')
const cwd = process.cwd()

module.exports = {
  entry: globEntries(path.join(cwd, 'src/assets/script/[!_]*.js')),
  output: {
    filename: `[name].js`,
    path: path.join(cwd, 'dist/assets/script/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
