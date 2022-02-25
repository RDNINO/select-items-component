<script>
import SelectItems from './components/SelectItems.vue'

export default {
  name: 'App',
  components: {
    SelectItems
  }
}
</script>

<template>
  <div id="app">
    <SelectItems />
</div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
