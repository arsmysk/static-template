const path = require('path')
const fs = require('fs-extra')

const postcss = require('postcss')
const cssModules = require('postcss-modules')
const autoPrefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const presetEnv = require('postcss-preset-env')
const partialImport = require("postcss-partial-import")

const {distPath, fromRoot} = require('../util')
const {DEV, config} = require('../constants')

const store = require('../store')
const {addClassNames} = require('../store/style')

const commonPlugins = [
  partialImport({
    prefix: '_',
  }),
  presetEnv({
    stage: 0
  }),
  cssModules({
    generateScopedName: '[name]_[local]_[hash:base64:5]',

    getJSON (cssFileName, json, outputFileName) {
      const nameSpace = path.basename(cssFileName, `${config.style.ext_from}`)
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

module.exports = filePaths => Promise.all(filePaths.map(async filePath => {
  const dist = distPath(filePath, config.style.ext_to)
  try {
    const css = await fs.readFile(filePath)
    const result = await postcss(usingPlugins).process(css, {from: filePath, to: dist})

    fs.outputFile(fromRoot(dist), result)
  } catch (err) {
    console.error(err)
  }
}))
