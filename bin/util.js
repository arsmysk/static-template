const fs = require('fs-extra')
const path = require('path')
const glob = require('globby')
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

exports.readFiles = async (matchPattern, stringify = true) => {
  const pathes = await glob(matchPattern)
  return Promise.all(pathes.map(async _path => {
    let error, data
    try {
      data = await fs.readFile(_path)
    } catch (err) {
       throw new Error(err)
    }

    return {
      file: _path,
      content: stringify ? data.toString() : data
    }
  }))
}

exports.buildFiles = builder => (store, files) => files.map(file => builder(store, file))

exports.outputFiles = callback => files => Promise.all(files.map(async ({file, content}) => {
  if (typeof callback === 'function') callback({file, content})
  await fs.outputFile(file, content)
}))

exports.clearDist = async () => fs.remove(path.resolve(CWD, config.dist))

exports.globWebpackEntries = (pattern, {debug} = {debug: false}) => {
  const entries = glob.sync(pattern)
    .reduce((acc, file) => ({
      ...acc,
      [file.replace(/.*\/(.+)\.[a-z]+$/g, '$1')]: file
    }), {})

  if (debug) console.log(entries)

  return entries
}
