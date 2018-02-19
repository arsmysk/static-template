const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')

const store = require('../store')

const {CWD} = require('../constants')
const {buildHtml, buildCss} = require('../builders')
require('./build')

console.log(chalk.green('Start watch build\n'))

const cssWatcher = chokidar.watch(path.resolve(CWD, 'src/**/*.css'), {ignored: /(^|[\/\\])\../})
const htmlWatcher = chokidar.watch(path.resolve(CWD, 'src/**/*.html'), {ignored: /(^|[\/\\])\../});

['add', 'change', 'unlink', 'unlinkDir'].forEach(eventName => {
  cssWatcher.on(eventName, () => {
    const isBuilding = store.getState().style.building
    if (!isBuilding) buildCss()
  })

  htmlWatcher.on(eventName, () => {
    const isBuilding = store.getState().style.building
    if (!isBuilding) buildHtml()
  })
})
