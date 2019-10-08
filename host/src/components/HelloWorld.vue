<template>
  <v-app id="inspire">
    <v-container>
      <v-layout column>
        <v-flex xs1>
          <v-text-field
            v-model="text"
            append-icon="send"
            box
            clear-icon="close"
            clearable
            label="Message"
            type="text"
            placeholder="Please input text."
            @click:append="setMessage"
            @keyup.enter="setMessage"
            @click:clear="clearMessage"
          ></v-text-field>
        </v-flex>
        <v-flex xs11>
          <v-layout row wrap>
            <div v-for="(item, key) in history" :key="key">
              <v-card dark :color="historyColor(item.type)" class="ma-1">
                <v-card-text>{{item.value}}</v-card-text>
              </v-card>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "firebase/app";
export default {
  name: "HelloWorld",
  data() {
    return {
      text: "",
      history: Array
    };
  },
  computed: {},
  methods: {
    clearMessage() {
      this.text = "";
    },
    // 入力した文字をfirebaseに登録する
    setMessage() {
      firebase
        .database()
        .ref("text")
        .set(this.text);
      this.text = "";
    },
    // 履歴が更新されたら呼ばれる
    onHistory() {
      let self = this;
      firebase
        .database()
        .ref("history")
        .on("value", function(snapshot) {
          let history = snapshot.val();
          self.reverseHistory(history);
        });
    },
    // 履歴の配列を表示するために降順に並びかえる
    reverseHistory(history) {
      let tempHistory = [];
      Object.keys(history).forEach(function(key) {
        tempHistory.push(history[key]);
      });
      this.history = tempHistory.reverse();
    },
    // 表示した履歴の色をtypeによって変える
    historyColor(type) {
      switch (type) {
        case "text":
          return "accent";
        case "speech":
          return "primary";
        default:
          return "accent";
      }
    }
  },
  mounted() {
    this.onHistory();
  },
  created() {}
};
</script>

<style>
html {
  overflow: hidden;
}
</style>
