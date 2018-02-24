const path = require('path')

module.exports = (store, {file, content}) => ({
  page: path.parse(file).name,
  data: JSON.parse(content),
})
