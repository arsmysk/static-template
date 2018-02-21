const {clearDist} = require('./util')
const {buildHtml, buildCss} = require('./builders')
const store = require('./store')

const handler = ({
  ready,
  didBuild,
} = {
  ready: new Function(),
  didBuild: new Function(),
}) => {
  store.dispatch({type: '@INIT'})
  let building = false
  let current = store.getState()

  // initial build
  ;(async () => {
    await clearDist()
    building = true
    await buildCss()
    await buildHtml()
    building = false
    ready()
  })()

  // handler
  return async () => {
    let results = []

    let previous = current
    current = store.getState()

    if (building || previous ===  current) return
    building = true

    if (previous.style.lastUpdated < current.style.lastUpdated) {
      results.push(await buildCss(), await buildHtml())
    }

    if (previous.template.lastUpdated < current.template.lastUpdated) {
      results.push(await buildHtml())
    }

    building = false
    results.forEach(result => didBuild(result))
  }
}

module.exports = (eventHandlers) => store.subscribe(handler(eventHandlers))
