const bs = require('browser-sync').create()
const {fromRoot} = require('./util')

const {config} = require('./constants')

module.exports = () => bs.init({server: fromRoot(config.dist), open: false})
module.exports.bs = bs
