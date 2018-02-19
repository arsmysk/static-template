const {combineReducers} = require('redux')

/** Actions */
const CLASSNAME_ADD = 'style/class_names/add'
const BUILDING_UPDATE = 'style/building/update'

/** Reducer */
const building = (state = false, {type, payload} = {type: '', payload: false}) => {
  switch (type) {
    case BUILDING_UPDATE:
      return payload
    default:
      return state
  }
}
const classNames = (state = {}, {type, payload} = {type: '', payload: {}}) => {
  switch (type) {
    case CLASSNAME_ADD:
      return {...state, ...payload}
    default:
      return state
  }
}

module.exports = combineReducers({building, classNames})

/** Action Creator */
module.exports.addClassNames = data => ({type: CLASSNAME_ADD, payload: data})
module.exports.updateBuilding = flag => ({type: BUILDING_UPDATE, payload: flag})
