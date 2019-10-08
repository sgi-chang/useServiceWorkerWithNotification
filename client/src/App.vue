<template>
  <div id="app">
    <v-container fulid fill-height>
      <HelloWorld/>
    </v-container>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  }
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
