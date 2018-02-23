<template>
  <h1 @click="message = 'Clicked!'">{{message}}</h1>
</template>

<script>
  export default {
    data () {
      return {
        message: 'Hello Vue.js. Click me!'
      }
    }
  }
</script>

<style scoped>
  h1 {
    cursor: pointer;
    display: inline-block;
    color: red;
  }
</style>
