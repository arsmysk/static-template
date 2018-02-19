const {combineReducers} = require('redux')

/** Actions */
const HTML_ADD = 'template/html/add'
const BUILDING_UPDATE = 'template/building/update'

/** Reducer */
const building = (state = false, {type, payload} = {type: '', payload: false}) => {
  switch (type) {
    case BUILDING_UPDATE:
      return payload
    default:
      return state
  }
}

const html = (state = '', {type, payload} = {type: '', payload: null}) => {
  switch (type) {
    case HTML_ADD:
      return payload
    default:
      return state
  }
}

module.exports = combineReducers({building, html})

/** Action Creator */
module.exports.addHtml = data => ({type: HTML_ADD, payload: data})
module.exports.updateBuilding = flag => ({type: BUILDING_UPDATE, payload: flag})
