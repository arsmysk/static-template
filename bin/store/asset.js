const {combineReducers} = require('redux')

/** Actions */
const LASTUPDETED_UPDATE = 'asset/lastUpdated/update'

/** Reducer */
const lastUpdated = (state = 0, {type, payload} = {type: '', payload: 0}) => {
  switch (type) {
    case LASTUPDETED_UPDATE:
      return payload
    default:
      return state
  }
}

module.exports = combineReducers({lastUpdated})

/** Action Creator */
module.exports.updateAsset = (time = Date.now()) => ({type: LASTUPDETED_UPDATE, payload: time})
