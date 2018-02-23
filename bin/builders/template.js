const fs = require('fs-extra')
const path = require('path')
const nunjucks = require('nunjucks')
const beautify = require('js-beautify').html

const {distPath, fromRoot} = require('../util')

const store = require('../store')
const {addHtml} = require('../store/template')
const {config, CWD} = require('../constants')

nunjucks.configure(path.join(CWD, 'src'), {
  autoescape: true,
  lstripBlocks: true,
  trimBlocks: true,
})

beautifyConfig = {
  'indent_size': 2,
  'end_with_newline': true,
  'preserve_newlines': true,
  'max_preserve_newlines': 1,
  'wrap_line_length': 120,
}

module.exports = async filePaths => {
  const state = store.getState()
  const css = state.style.classNames
  const data = state.data.entities

  await Promise.all(filePaths.map(async filePath => {
    const page = path.basename(filePath, path.extname(filePath))
    const dist = distPath(filePath, config.template.ext_to)
    try {
      const result = await fs.readFile(filePath)
      const template = result.toString()
      const html = beautify(nunjucks.renderString(template,
        {...data[page], css, }), beautifyConfig)

      store.dispatch(addHtml(html))
      await fs.outputFile(dist, html)
    } catch (err) {
      console.error(err)
    }
  }))
}
