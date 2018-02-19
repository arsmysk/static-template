const {buildCss} = require('../builders')
const init = require('../initStore')
const {clearDist} = require('../util')

;(async () => {
  await clearDist()
  init()
  buildCss()
})()
