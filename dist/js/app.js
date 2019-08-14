(function () {
'use strict';

// @ts-nocheck
/* global firebase */

var App = {
  init: function init() {
    var that = this;
    var firebaseConfig = {
      apiKey: 'AIzaSyCmEjhSDdqEsmIdxe9VN4GI7IxTD2LhU4I',
      authDomain: 'testproject-48d5e.firebaseapp.com',
      databaseURL: 'https://testproject-48d5e.firebaseio.com',
      projectId: 'testproject-48d5e',
      storageBucket: 'testproject-48d5e.appspot.com',
      messagingSenderId: '121120459695',
      appId: '1:121120459695:web:e8ecc54371f88ce6'
    };

    firebase.initializeApp(firebaseConfig);
    this.database = firebase.firestore();
    var provider = new firebase.auth.FacebookAuthProvider();

    provider.setCustomParameters({
      display: 'popup'
    });

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var html = '\n          <div class="header">\n            <button class="logout-btn firebase-btn">\u0412\u044B\u0439\u0442\u0438</button>\n          </div>\n          <div class="page">\n            <div class="page__title">\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ' + user.displayName + '!</div>\n            <div class="page__subtitle">\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u043B\u0435\u0434 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438:</div>\n            <input class="page__input">\n            <button class="send firebase-btn">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</button>\n            <div class="list"></div>\n          </div>\n        ';

        $('#app').html(html);
        that.getList();
      } else {
        $('#app').html('<button class="auth-btn firebase-btn">Войти</button>');
      }
    });

    $('#app').on('click', '.auth-btn', function () {
      firebase.auth().signInWithPopup(provider);
    });

    $('#app').on('click', '.logout-btn', function () {
      firebase.auth().signOut();
    });

    $('#app').on('click', '.send', function () {
      var val = $('.page__input').val();

      if (val.length) {
        $('.page__input').val('');
        that.database.collection('sandbox').add({
          user: firebase.auth().currentUser.uid,
          text: val,
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function (docRef) {
          // eslint-disable-next-line
          console.log('Document written with ID: ', docRef.id);
          that.getList();
        }).catch(function (error) {
          // eslint-disable-next-line
          console.error('Error adding document: ', error);
        });
      }
    });

    $('#app').on('click', '.item__remove', function () {
      var _this = this;

      that.database.collection('sandbox').doc($(this).data('id')).delete().then(function () {
        $(_this).parent().remove();
      }).catch(function (error) {
        // eslint-disable-next-line
        console.error('Error removing document: ', error);
      });
    });
  },
  getList: function getList() {
    this.database.collection('sandbox').orderBy('created', 'desc').get().then(function (querySnapshot) {
      var list = querySnapshot.docs.map(function (item) {
        return '<div class="item">' + item.data().text + (item.data().user === firebase.auth().currentUser.uid ? '<span\n                  class="item__remove"\n                  data-id="' + item.id + '"\n                >\n                  +\n                </span>' : '') + '</div>';
      });

      $('.list').html(list.join(''));
    });
  }
};

$('document').ready(function () {
  App.init();
});

}());
//# sourceMappingURL=app.js.map
