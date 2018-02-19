const {buildHtml} = require('./builders')
const store = require('./store')

const handler = () => {
  let currentState

  return () => {
    let previousState = currentState
    currentState = store.getState()

    const initial = !previousState
    if (initial || previousState === currentState) return

    if ((!currentState.style.building && !currentState.template.building) &&
      (previousState.style !== currentState.style ||
        previousState.template.html !== currentState.template.html)) buildHtml()
  }
}

module.exports = () => store.subscribe(handler())
