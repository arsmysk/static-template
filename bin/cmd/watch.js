const path = require('path')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const chalk = require('chalk')

const initServer = require('../initserver')
const {bs} = require('../initserver')

const config = require('../../config')
const {distPath} = require('../util')

const initStore = require('../initStore')
const store = require('../store')
const {updateStyle} = require('../store/style')
const {updateTemplate} = require('../store/template')
const {updateAsset} = require('../store/asset')
const {updateData} = require('../store/data')
const {updateScript} = require('../store/script')

initStore(() => bs.reload('*.js'), {
  ready: initServer,
  didBuild: ({type}) => {
    switch (type) {
      case 'style':
        bs.reload(`*${config.style.ext_to}`)
      case 'template':
        bs.reload(`*${config.template.ext_to}`)
      case 'asset':
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
const cssWatcher = chokidar.watch(config.style.match_patterns, commonOptions)
const htmlWatcher = chokidar.watch(config.template.match_patterns, commonOptions)
const assetWatcher = chokidar.watch(config.copy_dir, commonOptions)
const dataWatcher = chokidar.watch('data', commonOptions)
// TODO: Commonize with webpack.config.js
const jsWatcher = chokidar.watch(`src/**/*.+(js|vue)`, commonOptions)

const initWatchers = async () => {
  console.log(chalk.green('Start watch build\n'))

  await Promise.all([
    new Promise(resolve => cssWatcher.on('ready', resolve)),
    new Promise(resolve => htmlWatcher.on('ready', resolve)),
    new Promise(resolve => assetWatcher.on('ready', resolve)),
    new Promise(resolve => dataWatcher.on('ready', resolve)),
    new Promise(resolve => jsWatcher.on('ready', resolve)),
  ])

  cssWatcher.on('all', async () => {
    store.dispatch(updateStyle())
  })

  htmlWatcher.on('all', async () => {
    store.dispatch(updateTemplate())
  })

  assetWatcher.on('all', async () => {
    store.dispatch(updateAsset())
  })
  assetWatcher.on('unlink', async file => {
    await fs.remove(distPath(file))
  })

  dataWatcher.on('all', async () => {
    store.dispatch(updateData())
  })

  jsWatcher.on('all', async () => {
    store.dispatch(updateScript())
  })
}
initWatchers()
