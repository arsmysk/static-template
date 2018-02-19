const bs = require('browser-sync').create()
const {fromRoot} = require('./util')

bs.init({server: fromRoot('dist'), open: false})

module.exports = bs
