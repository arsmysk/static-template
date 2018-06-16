<template>
  <h1 class="foo" @click="message = 'Clicked!'">{{message}}</h1>
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

<style lang="scss" scoped>
  @import 'assets/style/_variables';

  .foo {
    cursor: pointer;
    display: inline-block;
    color: $color;
  }
</style>
