const path = require('path')
const camelcase = require('camelcase')
const {promisify} = require('util')

const postcss = require('postcss')
const cssModules = require('postcss-modules')
const autoPrefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const sass = promisify(require('node-sass').render)

const {distPath} = require('../util')
const config = require('../../config')

const store = require('../store')
const {addClassNames} = require('../store/style')

const dev = process.env.NODE_ENV === 'development'

const commonPlugins = [
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
  const {css} = await sass({
    data: content,
    includePaths: [
      path.dirname(file),
      path.resolve(process.cwd(), config.src),
      path.resolve(process.cwd(), 'node_modules'),
    ],
  })

  const builded = await postcss(usingPlugins).process(css.toString(), {
    from: file,
    to: dist,
  })
  return {file: dist, content: builded}
}
