<template>
  <v-container fulid fill-height @click="screen()">
    <v-layout column fill-height>
      <v-flex xs2>
        <v-layout align-center justify-center fill-height row>
          <div class="headline">おはなしをするときはがめんをタッチしてね！</div>
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-layout align-center justify-center fill-height>
          <img src="../assets/animal_fukurou.png" />
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout align-center justify-center fill-height>
          <v-icon x-large v-show="mic" color="red" class="flash">settings_voice</v-icon>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import axios from "axios";
const synth = window.speechSynthesis;
export default {
  name: "HelloWorld",
  data() {
    return {
      text: "",
      mic: false
    };
  },
  watch: {
    // firebaseのtextが更新されたら呼ばれる
    text(val) {
      if (val) {
        // hostで入力した文字を発話させる
        this.textToSpeech(val);
        // hostで入力した文字を履歴に残す
        this.updateHistory(val, "text");
      }
    }
  },
  created() {
    // speechSynthesis.speak() without user activation is no longer allowed since M71, around December 2018. See https://www.chromestatus.com/feature/5687444770914304 for more details
    // let msg = "話すときは画面をタッチしてね！";
    // this.textToSpeech(msg);
  },
  methods: {
    screen() {
      this.recognition();
    },
    // 音声認識
    recognition() {
      let self = this;
      self.mic = true;
      var recognition = new webkitSpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.start();
      recognition.onresult = function(event) {
        let speech = event.results[0][0].transcript;
        // 発話内容を履歴に残す
        self.updateHistory(speech, "speech");
      };
      recognition.onend = function(event) {
        self.mic = false;
        // push 通知
        self.sendPushNotification();
      };
    },
    // firebaseのtextが更新されたら呼ばれる
    onText() {
      let self = this;
      firebase
        .database()
        .ref("text")
        .on("value", function(snapshot) {
          let text = snapshot.val();
          self.text = text;
        });
    },
    // textの読み上げ
    textToSpeech(text) {
      let utterThis = new SpeechSynthesisUtterance(text);
      synth.speak(utterThis);
      utterThis.onerror = function(event) {
        console.log("SpeechSynthesisUtterance Error: " + event.utterance.text);
      };
    },
    // text,speechをfirebaseに更新する
    updateHistory(val, type) {
      let database = firebase.database().ref();
      let updates = {};
      let postData = {
        timeStamp: new Date().getTime(),
        type: type,
        value: val
      };
      var newPostKey = database.child("history").push().key;
      updates[`/history/${newPostKey}`] = postData;
      database.update(updates);
    },
    buildRequest(notification) {
      const fcmKey = process.env.VUE_APP_FIREBASE_PUBLIC_VAPID_KEY;
      const fcmURL = "https://fcm.googleapis.com/fcm/send";
      return {
        url: fcmURL,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${fcmKey}`
        },
        data: notification,
        to: this.token
      };
    },
    async sendPushNotification() {
      await this.getToken();
      const notification = this.buildNotification();
      console.log("notification", notification);
      const request = this.buildRequest(notification);
      console.log("request", request);
      axios(request)
        .then(r => {
          console.log(r);
        })
        .catch(error => {
          console.log(error);
        });
    },
    buildNotification() {
      return {
        data: {
          name: "owl"
        },
        to: this.token,
        priority: "high"
      };
    },
    async getToken() {
      let self = this;
      return firebase
        .database()
        .ref("token")
        .once("value", function(snapshot) {
          let token = snapshot.val();
          console.log("token", token);
          self.token = token;
        });
    }
  },
  mounted() {
    this.onText();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
/* マイク点滅 */
.flash {
  animation: flashing 1.5s ease-out;
  animation-iteration-count: infinite; /* 繰り返し回数 または infinite */
}
@keyframes flashing {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}
</style>
