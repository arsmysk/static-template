import Vue from 'vue'
import App from 'App'

import deps from 'mods/deps'

/** Reffering pcocess.env example */
console.log('NODE_ENV: ', process.env.NODE_ENV)
console.log('ACCESS_TOKEN from .env: ', process.env.ACCESS_TOKEN ||
  'You can add .*.env file in project root to reffer process.env entry from js')

/** Simply import example */
deps('Hello!')

/** Polyfill example(Promise, setImmediate) */
Promise.resolve().then(() => setImmediate(() => console.log('Promise() Polyfill')))

/** ES2015+ syntax example */
const asyncAwait = async () => {
  const data = await new Promise(resolve => setTimeout(() => {
    resolve('Async data')
  }, 1000))
  console.log('ES2015+ syntax: ', data)
}
asyncAwait()

/** Vue.js example */
const initVue = () => new Vue({
    render: h => h(App)
  }).$mount('#app')

if (document.readyState !== 'loading') {
  initVue()
} else {
  document.addEventListener('DOMContentLoaded', initVue)
}
