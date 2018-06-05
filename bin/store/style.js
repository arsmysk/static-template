const {combineReducers} = require('redux')
const merge = require('lodash/merge')

/** Actions */
const CLASSNAME_ADD = 'style/class_names/add'
const LASTUPDETED_UPDATE = 'style/lastUpdated/update'

/** Reducer */
const classNames = (state = {}, {type, payload} = {type: '', payload: {}}) => {
  switch (type) {
    case CLASSNAME_ADD:
      return merge(state, payload)
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

module.exports = combineReducers({classNames, lastUpdated})

/** Action Creator */
module.exports.addClassNames = data => ({type: CLASSNAME_ADD, payload: data})
module.exports.updateStyle = (time = Date.now()) => ({
  type: LASTUPDETED_UPDATE,
  payload: time,
})
