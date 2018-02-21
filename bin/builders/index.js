const {promisify} = require('util')
const glob = promisify(require('glob'))
const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment')

const buildTemplate = require('./template')
const buildStyle = require('./style')

const cssSpinner = ora('Building Stylesheet')
const htmlSpinner = ora('Building HTML')

module.exports.buildHtml = async () => {
  let error

  try {
    const filePaths = await glob('src/**/*.html')
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
    type: 'html',
    error,
  }
}

module.exports.buildCss = async () => {
  let error

  try {
    const filePaths = await glob('src/**/*.css')
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
    type: 'css',
    error,
  }
}
