const fs = require('fs-extra')
const path = require('path')
const build = require('consolidate').handlebars

const {distPath, fromRoot} = require('../util')

const store = require('../store')
const {addHtml} = require('../store/template')
const {config} = require('../constants')

module.exports = async filePaths => {
  const state = store.getState()
  const css = state.style.classNames
  const data = state.data.entities

  await Promise.all(filePaths.map(async filePath => {
    const page = path.basename(filePath, path.extname(filePath))
    const dist = distPath(filePath, config.template.ext_to)
    try {
      const html = await build(filePath, {...data[page], css, })

      store.dispatch(addHtml(html))
      await fs.outputFile(dist, html)
    } catch (err) {
      console.error(err)
    }
  }))
}
