const {combineReducers} = require('redux')

/** Actions */
const HTML_ADD = 'template/html/add'
const LASTUPDETED_UPDATE = 'template/lastUpdated/update'

/** Reducer */
const html = (state = '', {type, payload} = {type: '', payload: null}) => {
  switch (type) {
    case HTML_ADD:
      return payload
    default:
      return state
  }
}

const lastUpdated = (state = 0, {type, payload} = {type: '', payload: 0}) => {
  switch (type) {
    case LASTUPDETED_UPDATE:
      return payload
    default:
      return state
  }
}

module.exports = combineReducers({html, lastUpdated})

/** Action Creator */
module.exports.addHtml = data => ({type: HTML_ADD, payload: data})
module.exports.updateTemplate = (time = Date.now()) => ({
  type: LASTUPDETED_UPDATE,
  payload: time,
})
