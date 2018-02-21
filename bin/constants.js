exports.CWD = process.cwd()
exports.DEV = process.env.NODE_ENV === 'development'
exports.config = require('../config')(process.env.NODE_ENV === 'development' ?
  'development' :
  'production'
)
