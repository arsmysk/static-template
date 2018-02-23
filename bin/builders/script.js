const {promisify} = require('util')
const webpack = promisify(require('webpack'))
const config = require('../../config/webpack.config')

const main = async () => {
  console.log('init')
  await webpack(config)
}
main()
