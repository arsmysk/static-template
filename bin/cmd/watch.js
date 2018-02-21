const {fromRoot} = require('../util')
const chokidar = require('chokidar')
const chalk = require('chalk')

const initServer = require('../initserver')
const {bs} = require('../initserver')

const initStore = require('../initStore')
const store = require('../store')
const {updateStyle} = require('../store/style')
const {updateTemplate} = require('../store/template')

initStore({
  ready: initServer,
  didBuild: ({type}) => {
    switch (type) {
      case 'css':
        bs.reload('*.css')
      case 'html':
        bs.reload('*.html')
    }
  }
})

const commonOptions = {
  ignored: /(^|[\/\\])\../,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  }
}
const cssWatcher = chokidar.watch(fromRoot('src/**/*.css'), commonOptions)
const htmlWatcher = chokidar.watch(fromRoot('src/**/*.html'), commonOptions)

const initWatchers = async () => {
  console.log(chalk.green('Start watch build\n'))

  await Promise.all([
    new Promise(resolve => cssWatcher.on('ready', resolve)),
    new Promise(resolve => htmlWatcher.on('ready', resolve)),
  ])

  cssWatcher.on('all', async (ev) => {
    store.dispatch(updateStyle())
  })

  htmlWatcher.on('all', async (ev) => {
    store.dispatch(updateTemplate())
  })
}
initWatchers()
