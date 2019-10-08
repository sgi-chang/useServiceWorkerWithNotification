
// Push通知を受け取ると呼ばれる
self.addEventListener('push', function (event) {
  // メッセージを表示する
  let name = ((((event || {}).data || {}).json() || {}).data || {}).name || 'ふくろう';
  event.waitUntil(
    self.registration.showNotification(`${name}さんから`, {
      'body': 'メッセージが届いています。',
    })
  );
});

// 表示したNotificationがclickしたら呼ばれる
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  // ページを表示する
  focusWindow(event);
});

// フォアグラウンド、バックグラウンド、クローズ時に合わせて表示する
// フォアグラウンド…そのまま
// バックグラウンド…遷移する
// クローズ…新規に開く
function focusWindow(event) {
  const myPage = self.location.origin;
  const urlToOpen = new URL(myPage, self.location.origin).href;
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
    .then((windowClients) => {
      let matchingClient = null;
      // ブラウザのタブ、windowを検索
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        // フォアグラウンド時
        // 開いているページなのでそのまま
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }
      // バックグラウンド時
      // 該当のページに遷移する
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        // クローズ時
        // ページを新規に開く
        return clients.openWindow(urlToOpen);
      }
    });
  event.waitUntil(promiseChain);
}

// クローズ時
// ページを新規に開く
function openWindow(event) {
  const myPage = self.location.origin;
  const promiseChain = clients.openWindow(myPage);
  event.waitUntil(promiseChain);
}