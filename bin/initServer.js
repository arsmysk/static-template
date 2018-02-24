const path = require('path')
const bs = require('browser-sync').create()

const {server} = require('../config')

module.exports = () => bs.init(server)
module.exports.bs = bs
