importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFdOKWuEuiJuL9krC9Ox1Fwmzo7jCHwj8",
  authDomain: "tienda724-2b59f.firebaseapp.com",
  databaseURL: "https://tienda724-2b59f.firebaseio.com",
  projectId: "tienda724-2b59f",
  storageBucket: "tienda724-2b59f.appspot.com",
  messagingSenderId: "144414363068",
  appId: "1:144414363068:web:89da27a3935cdbfe1d2fb9",
  measurementId: "G-QPPW2FS344"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging); //<--this
messaging.onMessage = messaging.onMessage.bind(messaging); //<-- and this `

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
