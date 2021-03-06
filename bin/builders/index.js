const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs-extra')
const {distPath, readFiles, buildFiles, outputFiles} = require('../util')

const buildTemplate = require('./template')
const buildStyle = require('./style')
const buildScript = require('./script')
const loadJson = require('./data')
const config = require('../../config')

const store = require('../store')
const {addHtml} = require('../store/template')
const {updateEntities} = require('../store/data')

const cssSpinner = ora('Building Stylesheet')
const htmlSpinner = ora('Building HTML')
const assetSpinner = ora('Update Asset')
const dataSpinner = ora('Update Data')
const scriptSpinner = ora('Building JavaScript')

const stopSpinnerGracefully = ({error, spinner, symbol, warning, success}) => {
  const text =
    (error ? warning : success) + chalk.gray(' @', moment().format('h:mm:ss'))
  const color = error ? chalk.red : chalk.white

  spinner.stopAndPersist({
    symbol,
    text: color(text),
  })
}

module.exports.buildHtml = async () => {
  htmlSpinner.start()
  const builder = buildFiles(buildTemplate)
  let error

  const from = config.src
  const matchPatterns = config.template.match_patterns

  try {
    const files = await readFiles(matchPatterns)
    const results = builder(store.getState(), files).map(({file, content}) => ({
      file: distPath(file, config.template.ext),
      content,
    }))
    await outputFiles(({file}) => store.dispatch(addHtml(file)))(results)
  } catch (err) {
    htmlSpinner.stop()
    console.error(chalk.red(err))
    error = err
  }

  stopSpinnerGracefully({
    error,
    spinner: htmlSpinner,
    symbol: '📝 ',
    success: 'Build HTML',
    warning: 'Build Faild',
  })
  return {
    type: 'template',
    error,
  }
}
module.exports.buildCss = async () => {
  cssSpinner.start()
  const builder = buildFiles(buildStyle)
  let error
  const from = config.src
  const entry = config.style.entry
  const matchPatterns = [
    ...config.style.match_patterns,
    // exclude entry files from other css
    ...entry.map(ent => `!${ent}`),
  ]
  try {
    // FIXME: It's tooo complex ;(
    const entryFiles = await readFiles(entry)
    const entryPortions = builder(undefined, entryFiles)
    const othersFiles = await readFiles(matchPatterns)
    const othersPortions = builder(undefined, othersFiles)
    const results = await Promise.all(
      // others portion need entryFiles path
      entryFiles.map(async (ent, idx) => {
        const results = await Promise.all([
          entryPortions[idx](distPath(ent.file, config.style.ext)),
          ...othersPortions.map(portion =>
            portion(distPath(ent.file, config.style.ext)),
          ),
        ])
        // concat each data
        return results.reduce(
          (acc, {file, content}) => ({
            file,
            content: `${acc.content}\n${content}`,
          }),
          {content: '', file: ''},
        )
      }),
    )
    await outputFiles()(results)
  } catch (err) {
    cssSpinner.stop()
    console.error(chalk.red(err))
    error = err
  }
  stopSpinnerGracefully({
    error,
    spinner: cssSpinner,
    symbol: '🎨 ',
    success: 'Build Stylesheet',
    warning: 'Build Faild',
  })
  return {
    type: 'style',
    error,
  }
}
module.exports.copyAssets = async () => {
  assetSpinner.start()
  const builder = buildFiles((state, {file}) =>
    fs.copy(file, distPath(file), false),
  )
  let error
  const matchPatterns = config.copy_dir
  try {
    const files = await readFiles(matchPatterns)
    if (files.length < 1 && matchPatterns.length !== 0)
      throw new Error('There are no files to copy')
    await builder(undefined, files)
  } catch (err) {
    assetSpinner.stop()
    console.error(chalk.red(err))
    error = err
  }
  stopSpinnerGracefully({
    error,
    spinner: assetSpinner,
    symbol: '📦 ',
    success: 'Copy Assets',
    warning: 'Copy Faild',
  })
  return {
    type: 'asset',
    error,
  }
}
module.exports.loadData = async () => {
  dataSpinner.start()
  const builder = buildFiles(loadJson)
  let error
  try {
    const files = await readFiles('data/*.json')
    const data = builder(undefined, files).reduce(
      (acc, {page, data}) => ({
        ...acc,
        [page]: data,
      }),
      {},
    )
    store.dispatch(updateEntities(data))
  } catch (err) {
    dataSpinner.stop()
    console.error(chalk.red(err))
    error = err
  }
  stopSpinnerGracefully({
    error,
    spinner: dataSpinner,
    symbol: '🗂 ',
    success: 'Update Data',
    warning: 'Update Faild',
  })
  return {
    type: 'data',
    error,
  }
}
module.exports.buildJs = async jsWatcher => {
  const {runner, watcher} = buildScript
  if (jsWatcher) {
    watcher((err, stats) => {
      // error handling: https://webpack.js.org/api/node/#error-handling
      if (err) {
        console.error(err.stack || err)
        if (err.details) console.error(err.details)
        return
      }
      const info = stats.toJson()
      if (stats.hasWarnings()) console.log(new Error(info.warnings).message)
      const error = stats.hasErrors() && info.errors
      if (error) console.log(new Error(info.errors).message)
      stopSpinnerGracefully({
        error,
        spinner: scriptSpinner,
        symbol: '🦄 ',
        success: 'Build JavaScript',
        warning: 'Build Faild',
      })
      jsWatcher()
    })
  } else {
    let error
    scriptSpinner.start()
    try {
      const stats = await runner()
      const info = stats.toJson()
      if (stats.hasWarnings()) console.log(new Error(info.warnings).message)
      if (stats.hasErrors() && info.errors) throw new Error(info.errors)
    } catch (err) {
      scriptSpinner.stop()
      console.log(err.message)
      error = err
    }
    stopSpinnerGracefully({
      error,
      spinner: scriptSpinner,
      symbol: '🦄 ',
      success: 'Build JavaScript',
      warning: 'Build Faild',
    })
    return {
      type: 'script',
      error,
    }
  }
}
