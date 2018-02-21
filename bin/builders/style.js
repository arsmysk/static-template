const path = require('path')
const fs = require('fs-extra')

const postcss = require('postcss')
const cssModules = require('postcss-modules')
const autoPrefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const presetEnv = require('postcss-preset-env')
const atImport = require("postcss-import")

const {distPath, fromRoot} = require('../util')
const {DEV} = require('../constants')

const store = require('../store')
const {addClassNames} = require('../store/style')

const commonPlugins = [
  atImport(),
  presetEnv({
    stage: 0
  }),
  cssModules({
    generateScopedName: '[name]_[local]_[hash:base64:5]',

    getJSON (cssFileName, json, outputFileName) {
      const nameSpace = path.basename(cssFileName, '.css')
      store.dispatch(addClassNames({[nameSpace]: json}))
    }
  }),
]

const productionPlugins = [
  autoPrefixer,
  mqpacker,
  cssnano,
]

const usingPlugins = DEV ? commonPlugins :
  [...commonPlugins,
    ...productionPlugins,
  ]

module.exports = async filePaths => {
  const styleSheets = []

  await Promise.all(filePaths.map(async filePath => {
    const dist = distPath(filePath)
    try {
      const css = await fs.readFile(filePath)
      const result = await postcss(usingPlugins).process(css, {from: filePath, to: dist})

      styleSheets.push(result.css)
    } catch (err) {
      console.error(err)
    }
  }))

  await fs.outputFile(fromRoot('dist/assets/style/style.css'), styleSheets.join('\n'))
}
