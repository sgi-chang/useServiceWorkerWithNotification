<template>
  <v-app>
    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>
<script>
import HelloWorld from "./components/HelloWorld";
export default {
  name: "app",
  components: {
    HelloWorld
  }
};
</script>
<style>
</style>
