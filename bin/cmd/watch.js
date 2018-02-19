const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')

const store = require('../store')

const {CWD} = require('../constants')
const {buildHtml, buildCss} = require('../builders')
const bs = require('../server')
require('./build')

console.log(chalk.green('Start watch build\n'))

const cssWatcher = chokidar.watch(path.resolve(CWD, 'src/**/*.css'), {ignored: /(^|[\/\\])\../})
const htmlWatcher = chokidar.watch(path.resolve(CWD, 'src/**/*.html'), {ignored: /(^|[\/\\])\../});

['add', 'change', 'unlink', 'unlinkDir'].forEach(eventName => {
  cssWatcher.on(eventName, async () => {
    const isBuilding = store.getState().style.building
    if (!isBuilding) await buildCss()

    // FIXME
    setTimeout(() => {
      bs.reload('*.css')
      bs.reload('*.html')
    }, 500)
  })

  htmlWatcher.on(eventName, () => {
    const isBuilding = store.getState().style.building
    if (!isBuilding) buildHtml()
    bs.reload('*.html')
  })
})
