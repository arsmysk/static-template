const fs = require('fs-extra')
const build = require('consolidate').handlebars

const {distPath} = require('../util')

const store = require('../store')
const {addHtml} = require('../store/template')
const {config} = require('../constants')

module.exports = async filePaths => {
  const css = store.getState().style.classNames

  await Promise.all(filePaths.map(async filePath => {
    const dist = distPath(filePath, config.template.ext_to)
    try {
      const html = await build(filePath, { user: 'Developer', css, })
      store.dispatch(addHtml(html))
      await fs.outputFile(dist, html)
    } catch (err) {
      console.error(err)
    }
  }))
}
