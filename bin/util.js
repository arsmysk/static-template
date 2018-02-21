const fs = require('fs-extra')
const path = require('path')
const {CWD, config} = require('./constants')

exports.fromRoot = relativePath => path.resolve(CWD, relativePath)

exports.distPath = (filePath, ext = path.extname(filePath)) => {
  const distPath = filePath.split('/')
    .reduce((acc, piece) => {
      let newPiece, newIsReplaced

      if (!acc.isReplaced && piece === config.src) {
        newPiece = config.dist
        newIsReplaced = true
      } else {
        newPiece = piece
        newIsReplaced = acc.isReplaced
      }

      return {isReplaced: newIsReplaced, pathes: [...acc.pathes, newPiece]}
    }, {isReplaced: false, pathes: []})
    .pathes.join('/')

  return path.format({...path.parse(distPath),
    name: path.basename(distPath, path.extname(distPath)),
    base: '',
    ext
  })
}

exports.clearDist = async () => fs.remove(path.resolve(CWD, config.dist))
