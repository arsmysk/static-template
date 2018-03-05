const fs = require('fs-extra')
const path = require('path')
const glob = require('globby')
const config = require('../config')

exports.distPath = (filePath, ext = path.extname(filePath)) => {
  const pattern = new RegExp(config.src.replace(/\//g, '\\/'))
  const distPath = filePath.replace(pattern, config.dist)

  return path.format({
    ...path.parse(distPath),
    name: path.parse(distPath).name,
    base: '',
    ext,
  })
}

exports.readFiles = async (matchPattern, stringify = true) => {
  const pathes = await glob(matchPattern)
  return Promise.all(
    pathes.map(async _path => {
      let error, data
      try {
        data = await fs.readFile(_path)
      } catch (err) {
        throw new Error(err)
      }

      return {
        file: _path,
        content: stringify ? data.toString() : data,
      }
    }),
  )
}

exports.buildFiles = builder => (store, files) =>
  files.map(file => builder(store, file))

exports.outputFiles = callback => files =>
  Promise.all(
    files.map(async ({file, content}) => {
      if (typeof callback === 'function') callback({file, content})
      await fs.outputFile(file, content)
    }),
  )

exports.clearDist = async () => fs.remove(path.join(process.cwd(), config.dist))

exports.globWebpackEntries = (pattern, {debug} = {debug: false}) => {
  const entries = glob.sync(pattern).reduce(
    (acc, file) => ({
      ...acc,
      [file.replace(/.*\/(.+)\.[a-z]+$/g, '$1')]: file,
    }),
    {},
  )

  if (debug) console.log(entries)

  return entries
}

exports.stripExcMark = str => str.replace(/^\!/g, '')
