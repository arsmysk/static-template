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
const buildScript = require('./script')
const {config} = require('../constants')

const store = require('../store')
const {updateEntities} = require('../store/data')

const cssSpinner = ora('Building Stylesheet')
const htmlSpinner = ora('Building HTML')
const assetSpinner = ora('Update Asset')
const dataSpinner = ora('Update Data')
const scriptSpinner = ora('Building JavaScript')

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
      symbol: '📝 ',
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
    const filePathes = await glob(matchPattern)
    cssSpinner.start()
    await buildStyle(filePathes)
    cssSpinner.stopAndPersist({
      symbol: '🎨 ',
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
    assetSpinner.start()
    await Promise.all(filePathes.map(filePath => fs.copy(filePath, distPath(filePath))))
    assetSpinner.stopAndPersist({
      symbol: '📦 ',
      text: `Copy Assets ${chalk.gray('@', moment().format('h:mm:ss'))}`
    })
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
    dataSpinner.start()
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

    dataSpinner.stopAndPersist({
      symbol: '🗂 ',
      text: `Update Data ${chalk.gray('@', moment().format('h:mm:ss'))}`
    })
  } catch (err) {
    error = err
  }

  return {
    type: 'data',
    error,
  }
}

// TODO: refactor below code
module.exports.buildJs = async jsWatcher => {
  let error
  const {runner, watcher} = buildScript()

  if (jsWatcher) {
    watcher((err, stats) => {
      // error handling: https://webpack.js.org/api/node/#error-handling
      if (err) {
        console.error(err.stack || err)
        if (err.details) console.error(err.details)
        return
      }

      const info = stats.toJson()

      if (stats.hasErrors()) console.error(info.errors)
      if (stats.hasWarnings()) console.warn(info.warnings)

      scriptSpinner.stopAndPersist({
        symbol: '🦄 ',
        text: `Build JavaScript ${chalk.gray('@', moment().format('h:mm:ss'))}`
      })

      jsWatcher()
    })
  } else {
    try {
      scriptSpinner.start()
      await runner()
      scriptSpinner.stopAndPersist({
        symbol: '🦄 ',
        text: `Build JavaScript ${chalk.gray('@', moment().format('h:mm:ss'))}`
      })
    } catch (err) {
      error = err
    }
  }

  return {
    type: 'script',
    error,
  }
}
