const {combineReducers} = require('redux')
const template = require('./template')
const style = require('./style')
const asset = require('./asset')

module.exports = combineReducers({template, style, asset})
