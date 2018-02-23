const path = require('path')

module.exports = (store, {file, content}) => ({
  page: path.basename(file, path.extname(file)),
  data: JSON.parse(content),
})
