import firebase from "firebase/app";

export default class cloudMessaging {
    constructor() {
        // メッセージング オブジェクトの取得
        this.messaging = firebase.messaging();
        // アプリにウェブ認証情報を設定する
        this.messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLIC_VAPID_KEY);
    }
    initialize() {
        // 通知の受信許可をリクエストする
        this.messaging.requestPermission().then(() => {
            console.log('Notification permission granted.');

            // 現在の登録トークンの取得
            this.messaging.getToken().then((token) => {
                this.sendTokenToServer(token);
                console.log('token', token);
            })

            // トークン更新のモニタリング
            this.messaging.onTokenRefresh(() => {
                this.messaging.getToken().then((refreshedToken) => {
                    console.log('Token refreshed.', refreshedToken);
                }).catch((err) => {
                    console.log('Unable to retrieve refreshed token ', err);
                });
            });
        }).catch((err) => {
            console.log('Unable to get permission to notify.', err);
        });
    }
    sendTokenToServer(token) {
        firebase
            .database()
            .ref("token")
            .set(token);
    }
}