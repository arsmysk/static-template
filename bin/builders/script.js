const {promisify} = require('util')
const webpack = require('webpack')
const config = require('../../config/webpack.config')

const compiler = webpack(config)

module.exports = {
  runner: promisify(compiler.run.bind(compiler)),
  watcher: handler => compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /(node_modules|bower_components)/
  }, handler)
}
