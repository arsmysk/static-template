const fs = require('fs-extra')
const build = require('consolidate').handlebars

const {distPath} = require('../util')
const {CWD} = require('../constants')

const store = require('../store')
const {addHtml, updateBuilding} = require('../store/template')

module.exports = async filePaths => {
  store.dispatch(updateBuilding(true))

  const css = store.getState().style.classNames

  await Promise.all(filePaths.map(async filePath => {
    const dist = distPath(filePath)
    try {
      const html = await build(filePath, { user: 'Developer', css, })
      store.dispatch(addHtml(html))
      await fs.outputFile(dist, html)
    } catch (err) {
      console.error(err)
    }
  }))

  store.dispatch(updateBuilding(false))
}
