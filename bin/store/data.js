const {combineReducers} = require('redux')

/** Actions */
const ENTITIES_UPDATE = 'data/entities/update'
const LASTUPDETED_UPDATE = 'data/lastUpdated/update'

/** Reducer */
const entities = (state = {}, {type, payload} = {type: '', payload: {}}) => {
  switch (type) {
    case ENTITIES_UPDATE:
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

module.exports = combineReducers({entities, lastUpdated})

/** Action Creator */
module.exports.updateEntities = data => ({type: ENTITIES_UPDATE, payload: data})
module.exports.updateData = (time = Date.now()) => ({type: LASTUPDETED_UPDATE, payload: time})
