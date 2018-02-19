const path = require('path')
const fs = require('fs-extra')
const shortId = require('shortid')

const postcss = require('postcss')
const cssModules = require('postcss-modules')
const autoPrefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')

const {distPath} = require('../util')
const {DEV, CWD} = require('../constants')

const store = require('../store')
const {addClassNames, updateBuilding} = require('../store/style')

const commonPlugins = [
  cssModules({
    generateScopedName (name, filename, css) {
      const i = css.indexOf(`.${name}`)
      const line = css.substr(0, i).split(/[\r\n]/).length
      const file = path.basename(filename, '.css')

      return `${file}_${name}_${shortId.generate()}`
    },

    getJSON (cssFileName, json, outputFileName) {
      const nameSpace = path.basename(cssFileName, '.css')
      store.dispatch(addClassNames({[nameSpace]: json}))
    }
  }),
  mqpacker,
]

const productionPlugins = [
  autoPrefixer,
  cssnano,
]

const usingPlugins = DEV ? commonPlugins :
  [...commonPlugins,
    ...productionPlugins,
  ]

module.exports = async filePaths => {
  store.dispatch(updateBuilding(true))

  const styleSheets = []

  await Promise.all(filePaths.map(async filePath => {
    const dist = distPath(filePath)
    try {
      const css = await fs.readFile(filePath)
      const {css: data} = await postcss(usingPlugins).process(css, {from: filePath, to: dist})
      styleSheets.push(data)
    } catch (err) {
      console.error(err)
    }
  }))

  await fs.outputFile(path.resolve(CWD, 'dist/assets/style/style.css'), styleSheets.join('\n'))

  store.dispatch(updateBuilding(false))
}
