const {combineReducers} = require('redux')
const template = require('./template')
const style = require('./style')

module.exports = combineReducers({template, style})
