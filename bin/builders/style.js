const path = require('path')
const camelcase = require('camelcase')

const postcss = require('postcss')
const cssModules = require('postcss-modules')
const autoPrefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const presetEnv = require('postcss-preset-env')
const partialImport = require('postcss-partial-import')
const calc = require('postcss-calc')

const {distPath} = require('../util')
const config = require('../../config')

const store = require('../store')
const {addClassNames} = require('../store/style')

const dev = process.env.NODE_ENV === 'development'

const commonPlugins = [
  partialImport({
    prefix: '_',
  }),
  presetEnv({
    stage: 0,
  }),
  calc(),
  cssModules({
    generateScopedName: '[name]_[local]_[hash:base64:5]',

    getJSON(cssFileName, json, outputFileName) {
      const nameSpace = camelcase(path.parse(cssFileName).name)
      const cameledJson = Object.entries(json).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [camelcase(key)]: val,
        }),
        {},
      )

      store.dispatch(addClassNames({[nameSpace]: cameledJson}))
    },
  }),
]

const productionPlugins = [autoPrefixer, mqpacker, cssnano]

const usingPlugins = dev
  ? commonPlugins
  : [...commonPlugins, ...productionPlugins]

module.exports = (store, {file, content}) => async dist => {
  const builded = await postcss(usingPlugins).process(content, {
    from: file,
    to: dist,
  })
  return {file: dist, content: builded}
}
