const {clearDist} = require('./util')
const {
  buildHtml,
  buildCss,
  copyAssets,
  loadData,
  buildJs,
} = require('./builders')
const store = require('./store')

const handler = (
  jsWatcher,
  {ready, didBuild} = {
    ready: new Function(),
    didBuild: new Function(),
  },
) => {
  store.dispatch({type: '@INIT'})
  let building = false
  let current = store.getState()

  // initial build
  ;(async () => {
    await clearDist()
    building = true

    await Promise.all([buildCss(), loadData()])

    await Promise.all([buildHtml(), copyAssets(), buildJs(jsWatcher)])

    building = false
    ready()
  })()

  // handler
  return async () => {
    let results = []

    let previous = current
    current = store.getState()

    if (building || previous === current) return
    building = true

    if (previous.style.lastUpdated < current.style.lastUpdated) {
      results.push(await buildCss(), await buildHtml())
    }

    if (previous.data.lastUpdated < current.data.lastUpdated) {
      results.push(await loadData(), await buildHtml())
    }

    if (previous.template.lastUpdated < current.template.lastUpdated) {
      results.push(await buildHtml())
    }

    if (previous.asset.lastUpdated < current.asset.lastUpdated) {
      results.push(await copyAssets())
    }

    building = false
    results.forEach(result => didBuild(result))
  }
}

module.exports = (...args) => store.subscribe(handler(...args))
