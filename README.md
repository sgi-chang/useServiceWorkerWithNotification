# useWebSpeechAPI
client and host Vue app with Web Speech Api.

<img src="https://user-images.githubusercontent.com/49128348/57193920-7c627a80-6f7b-11e9-8ea5-55cb35d75f3d.png" alt="image" width="500" height="300">

## client
Even if you do not enter characters, you can communicate with voice and speech.

<img src="https://user-images.githubusercontent.com/49128348/57181869-18d14200-6ed4-11e9-8375-b5d965d28748.png" alt="image" width="500" height="500">

## host
Even if you don't have a microphone or speakers, you can still communicate using just text and text input, even if you can't hear voice.

<img src="https://user-images.githubusercontent.com/49128348/57181891-40280f00-6ed4-11e9-9150-f040f580b5f9.png" alt="image" width="500" height="500">

# Dependency
- Node.js
- Vue.js
- Vuetify
- Firebase
- Web Speech Api

# Config for Firebase
Set the configuration for your app
- host/src/firebase-config.js
- client/src/firebase-config.js
```sh
// TODO: Replace with your project's config object
export const firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com",
    storageBucket: "bucket.appspot.com"
}
```
See [firebase.google.com/docs](https://firebase.google.com/docs/database/web/start?authuser=0#initialize_the_javascript_sdk) for guidelines.


# Usage
## host
```sh
$ cd host
$ npm run serve
```
## client
```sh
$ cd client
$ npm run serve
```

# Licence
MIT License