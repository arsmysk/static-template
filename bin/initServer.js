const path = require('path')
const bs = require('browser-sync').create()

const config = require('../config')

module.exports = () => bs.init({
  server: path.join(process.cwd(), config.dist),
  open: false
})
module.exports.bs = bs
