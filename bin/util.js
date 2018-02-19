const fs = require('fs-extra')
const path = require('path')
const {CWD} = require('./constants')

exports.fromRoot = relativePath => path.resolve(CWD, relativePath)

exports.distPath = filePath => filePath.split('/')
  .reduce((acc, piece) => {
    let newPiece, newIsReplaced

    if (!acc.isReplaced && piece === 'src') {
      newPiece = 'dist'
      newIsReplaced = true
    } else {
      newPiece = piece
      newIsReplaced = acc.isReplaced
    }

    return {isReplaced: newIsReplaced, pathes: [...acc.pathes, newPiece]}
  }, {isReplaced: false, pathes: []})
  .pathes.join('/')

exports.clearDist = async () => fs.remove(path.resolve(CWD, 'dist'))
