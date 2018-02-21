const {promisify} = require('util')
const glob = promisify(require('glob'))
const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment')

const buildTemplate = require('./template')
const buildStyle = require('./style')
const {config} = require('../constants')

const cssSpinner = ora('Building Stylesheet')
const htmlSpinner = ora('Building HTML')

module.exports.buildHtml = async () => {
  let error
  const from = config.src
  const ext = config.template.ext_from
  const ignorePrefix = config.template.ignore_prefix

  try {
    const filePaths = await glob(`${from}/**/[!${ignorePrefix}]*${ext}`)
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
  const ignorePrefix = config.style.ignore_prefix

  try {
    const filePaths = await glob(`${from}/**/[!${ignorePrefix}]*${ext}`)
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
