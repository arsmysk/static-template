const bs = require('browser-sync').create()
const {fromRoot} = require('./util')

module.exports = () => bs.init({server: fromRoot('dist'), open: false})
module.exports.bs = bs
