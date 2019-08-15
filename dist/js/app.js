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
    this.storageService = firebase.storage();
    this.storageRef = this.storageService.ref();

    var provider = new firebase.auth.FacebookAuthProvider();

    provider.setCustomParameters({
      display: 'popup'
    });

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var html = '\n          <div class="header">\n            <button class="logout-btn firebase-btn">\u0412\u044B\u0439\u0442\u0438</button>\n          </div>\n          <div class="page">\n            <div class="page__title">\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ' + user.displayName + '!</div>\n            <div class="page__subtitle">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u0439\u043B \u0434\u043B\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438:</div>\n            <div id="filesubmit">\n              <input type="file" class="file-select" accept="image/*"/>\n              <div class="placeholder"></div>\n              <div class="msg"></div>\n              <button class="send firebase-btn">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</button>\n            </div>\n            \n            <div class="list"></div>\n          </div>\n        ';

        $('#app').html(html);
        that.getList();
      } else {
        $('#app').html('<div class="page"><button class="auth-btn firebase-btn">Войти</button><div class="list"></div></div>');
        that.getList();
      }
    });

    $('#app').on('click', '.auth-btn', function () {
      firebase.auth().signInWithPopup(provider);
    });

    $('#app').on('click', '.logout-btn', function () {
      firebase.auth().signOut();
    });

    // $('#app').on('click', '.send', function() {
    //   const val = $('.page__input').val()

    //   if (val.length) {
    //     $('.page__input').val('')
    //     that.database
    //       .collection('sandbox')
    //       .add({
    //         user: firebase.auth().currentUser.uid,
    //         text: val,
    //         created: firebase.firestore.FieldValue.serverTimestamp()
    //       })
    //       .then(function(docRef) {
    //         // eslint-disable-next-line
    //         console.log('Document written with ID: ', docRef.id)
    //         that.getList()
    //       })
    //       .catch(function(error) {
    //         // eslint-disable-next-line
    //         console.error('Error adding document: ', error)
    //       })
    //   }
    // })

    $('#app').on('click', '.item__remove', function () {
      var _this = this;

      that.database.collection('sandbox').doc($(this).data('id')).delete().then(function () {
        $(_this).parent().remove();
      }).catch(function (error) {
        // eslint-disable-next-line
        console.error('Error removing document: ', error);
      });
    });

    var selectedFile = void 0;

    $('#app').on('click', '.placeholder', function () {
      $('.file-select').click();
    });

    $('#app').on('change', '.file-select', function (e) {
      selectedFile = e.target.files[0];
      $('.placeholder').html('<img src="' + URL.createObjectURL(e.target.files[0]) + '" class="placeholder__img">');
    });

    $('#app').on('click', '.send', function () {
      var uploadTask = that.storageRef.child('images/' + selectedFile.name).put(selectedFile); // create a child directory called images, and place the file inside this directory

      uploadTask.on('state_changed', function (snapshot) {
        // eslint-disable-next-line
        console.log(snapshot);
      }, function (error) {
        // eslint-disable-next-line
        console.log(error);
      }, function () {
        $('.placeholder').empty();
        $('.msg').html('Изображение загружено');
        that.getList();
      });
    });
  },
  getList: function getList() {
    var that = this;
    var listRef = this.storageRef.child('images');

    $('.list').empty();
    listRef.listAll().then(function (res) {
      res.items.map(function (item) {
        that.storageService.ref(item.fullPath).getDownloadURL().then(function (url) {
          $('.list').append('\n                <img class="list__item" src="' + url + '">');
        });
      });
    }).catch(function (error) {
      // eslint-disable-next-line
      console.error(error);
    });
  }
};

$('document').ready(function () {
  App.init();
});

}());
//# sourceMappingURL=app.js.map
