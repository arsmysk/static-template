const path = require('path')

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

module.exports = (store, {file, content}) => async dist => {
  const builded = await postcss(usingPlugins).process(content, {from: file, to: dist})
  return {file: dist, content: builded}
}
