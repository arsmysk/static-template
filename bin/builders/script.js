const webpack = require('webpack')
const config = require('../../config/webpack.config')

const init = () => {
  const compiler = webpack(config)
  return {
    runner: () => new Promise((resolve, reject) =>
      compiler.run((err, stats) => {
        if (err) reject(err)
        resolve(stats)
      })
    ),
    watcher: handler => compiler.watch({
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /(node_modules|bower_components)/
    }, handler)
  }
}
module.exports = init
