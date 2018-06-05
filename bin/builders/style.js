const path = require('path')
const camelcase = require('lodash/camelcase')
const {promisify} = require('util')
const zipObjectDeep = require('lodash/fp/zipObjectDeep')
const filter = require('lodash/fp/filter')
const pipe = require('lodash/fp/pipe')

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
      const moduleRoot = path.join(
        process.cwd(),
        config.style.cssModulePathRoot,
        '/',
      )
      const cameledJson = Object.entries(json).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [camelcase(key)]: val,
        }),
        {},
      )

      const data = pipe([
        str => str.replace(moduleRoot, ''),
        str => str.split('/'),
        filter(str => !!str),
        arr => arr.map(str => camelcase(path.parse(str).name)),
        arr => arr.join('.'),
        str => zipObjectDeep([str])([cameledJson]),
      ])(cssFileName)

      store.dispatch(addClassNames(data))
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
