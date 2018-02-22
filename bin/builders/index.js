const {promisify} = require('util')
const glob = promisify(require('glob'))
const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment')
const path = require('path')
const fs = require('fs-extra')
const {distPath, fromRoot} = require('../util')

const buildTemplate = require('./template')
const buildStyle = require('./style')
const {config} = require('../constants')

const store = require('../store')
const {updateEntities} = require('../store/data')

const cssSpinner = ora('Building Stylesheet')
const htmlSpinner = ora('Building HTML')

module.exports.buildHtml = async () => {
  let error
  const from = config.src
  const ext = config.template.ext_from
  const ignorePrefixes = config.template.ignore_prefixes.length > 0 ?
    `[!${config.template.ignore_prefixes.join('|')}]` :
    ''
  const ignoreDirs = config.template.ignore_dirs.length > 0 ?
    `!(${config.template.ignore_dirs.join('|')})` :
    ''
  const matchPattern = path.join(from, '/**/', ignoreDirs, `${ignorePrefixes}*${ext}`)

  try {
    const filePaths = await glob(matchPattern)
    htmlSpinner.start()
    await buildTemplate(filePaths)
    htmlSpinner.stopAndPersist({
      symbol: '📝',
      text: `Build HTML ${chalk.gray('@', moment().format('h:mm:ss'))}`
    })
  } catch (err) {
    error = err
  }

  return {
    type: 'template',
    error,
  }
}

module.exports.buildCss = async () => {
  let error
  const from = config.src
  const ext = config.style.ext_from
  const ignorePrefixes = config.style.ignore_prefixes.length > 0 ?
    `[!${config.style.ignore_prefixes.join('|')}]` :
    ''
  const ignoreDirs = config.style.ignore_dirs.length > 0 ?
    `!(${config.style.ignore_dirs.join('|')})` :
    ''
  const matchPattern = path.join(from, '/**/', ignoreDirs, `${ignorePrefixes}*${ext}`)

  try {
    const filePaths = await glob(matchPattern)
    cssSpinner.start()
    await buildStyle(filePaths)
    cssSpinner.stopAndPersist({
      symbol: '🎨',
      text: `Build Stylesheet ${chalk.gray('@', moment().format('h:mm:ss'))}`
    })
  } catch (err) {
    error = err
  }

  return {
    type: 'style',
    error,
  }
}

module.exports.copyAssets = async () => {
  let error
  let filePathes = config.copy_dir.map(dir => fromRoot(path.join(config.src, dir)))

  try {
    await Promise.all(filePathes.map(filePath => fs.copy(filePath, distPath(filePath))))
  } catch (err) {
    error = err
  }

  return {
    type: 'asset',
    error,
  }
}

module.exports.loadData = async () => {
  let error

  try {
    const filePathes = await glob(fromRoot(`data/*.json`))
    const data = await Promise.all(filePathes.map(async filePath => {
      const data = await fs.readFile(filePath)
      return {
        page: path.basename(filePath, path.extname(filePath)),
        data: JSON.parse(data.toString()),
      }
    }))

    const concateData = data.reduce((acc, {page, data}) => ({...acc,
      [page]: data
    }), {})

    store.dispatch(updateEntities(concateData))
  } catch (err) {
    error = err
  }

  return {
    type: 'data',
    error,
  }
}
