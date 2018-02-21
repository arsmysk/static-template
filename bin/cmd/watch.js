const {fromRoot} = require('../util')
const chokidar = require('chokidar')
const chalk = require('chalk')

const initServer = require('../initserver')
const {bs} = require('../initserver')

const {config} = require('../constants')
const initStore = require('../initStore')
const store = require('../store')
const {updateStyle} = require('../store/style')
const {updateTemplate} = require('../store/template')

initStore({
  ready: initServer,
  didBuild: ({type}) => {
    switch (type) {
      case 'style':
        bs.reload(`*${config.style.ext_to}`)
      case 'template':
        bs.reload(`*${config.template.ext_to}`)
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
const cssWatcher = chokidar.watch(fromRoot(`${config.src}/**/*${config.style.ext_from}`), commonOptions)
const htmlWatcher = chokidar.watch(fromRoot(`${config.src}/**/*${config.template.ext_from}`), commonOptions)

const initWatchers = async () => {
  console.log(chalk.green('Start watch build\n'))

  await Promise.all([
    new Promise(resolve => cssWatcher.on('ready', resolve)),
    new Promise(resolve => htmlWatcher.on('ready', resolve)),
  ])

  cssWatcher.on('all', async () => {
    store.dispatch(updateStyle())
  })

  htmlWatcher.on('all', async () => {
    store.dispatch(updateTemplate())
  })
}
initWatchers()
