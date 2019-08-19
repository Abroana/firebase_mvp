(function () {
'use strict';

var Cookie = {
  get: function get(name) {
    var matches = window.parent.document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)'));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  },
  set: function set(name, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var expires = options.expires;
    var cookieOption = options;
    var updatedCookie = void 0;
    var d = new Date();

    if (typeof expires === 'number' && expires) {
      d.setTime(d.getTime() + expires * 1000);
      expires = d;
    } else {
      expires = new Date(d.getTime() + 14 * 24 * 60 * 60 * 1000);
    }
    if (expires && expires.toUTCString) {
      expires = expires.toUTCString();
      cookieOption.expires = expires;
    }
    var cookieValue = encodeURIComponent(value);

    updatedCookie = name + '=' + cookieValue;
    Object.keys(cookieOption).forEach(function (propName) {
      updatedCookie += '; ' + propName;
      var propValue = cookieOption[propName];

      if (propValue !== true) {
        updatedCookie += '=' + propValue;
      }
    });
    window.parent.document.cookie = updatedCookie;
  },
  delete: function _delete(name) {
    this.set(name, '', { expires: -1 });
  }
};

var isMobile = function () {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  }

  return false;
}();

var appOptions = {
  authUrl: 'https://login.feature12.dnevnik.ru/oauth2',
  grantUrl: 'https://api.feature12.dnevnik.ru/v1/authorizations',
  scope: 'CommonInfo',
  clientId: 'cebd34d2c9b9442788135f71d731fdaf',
  redirectUrl: '' + window.location.origin + window.location.pathname + '?auth=dn',
  provider: 'firebase',
  api: 'https://api.feature12.dnevnik.ru/v1/',
  apiMobile: 'https://api.feature12.dnevnik.ru/modile/v1/',
  isMobile: isMobile,
  userLink: 'https://feature12.dnevnik.ru/user/user.aspx?user=',
  cdnPath: 'https://ad.csfeature12.dnevnik.ru/special/staging/petsforever/img/',
  cdnMain: 'https://ad.csfeature12.dnevnik.ru/special/staging/petsforever/',
  origin: '.feature12.dnevnik.ru',
  admins: ['1000006315838', '1000006435101', '1000004681017', '1000004934922', '1000005435557', '1000008630961', '1000003565717']
};

var Auth = {
  token: undefined,
  authType: '',

  auth: function auth(callback) {
    var that = this;

    function getToken() {
      var token = /access_token=([-0-9a-zA-Z_]+)/.exec(window.location.hash) || [];
      var authType = /auth=([-0-9a-zA-Z_]+)/.exec(window.location.search) || [];

      that.authType = authType[1];
      Cookie.set('authType', authType[1]);

      return token[1];
    }
    var token = Cookie.get(appOptions.provider + '_token') || getToken();

    if (undefined !== token) {
      var authType = this.authType || Cookie.get('authType');

      Cookie.delete(appOptions.provider + '-' + authType + '_token');
      Cookie.set(appOptions.provider + '-' + authType + '_token', token);
      this.token = token;
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      var error = /error=([-0-9a-zA-Z_]+)/.exec(window.location.hash) || [];

      if (undefined !== error[1]) {
        Cookie.delete(appOptions.provider + '_token');
        this.token = undefined;
      }
    }
  },
  getLink: function getLink() {
    return appOptions.authUrl + '?response_type=token&client_id=' + appOptions.clientId + '&scope=' + appOptions.scope + '&redirect_uri=' + appOptions.redirectUrl;
  }
};

// @ts-nocheck
/* global firebase */
var App = {
  init: function init() {
    var that = this;

    if (document.location.href.indexOf('access_token') > -1) {
      Auth.auth(function () {
        var path = window.location.pathname.substring(0, window.location.pathname.length);

        history.pushState('', document.title, path);
      });
    }

    var authType = Cookie.get('authType');
    var token = Cookie.get(appOptions.provider + '-' + authType + '_token');

    if (token) {
      switch (authType) {
        case 'vk':
          that.getToken('https://api.feature12.dnevnik.ru/v2/firebase/vktoken?vkToken=' + token + '&lang=ru');
          break;
        case 'dn':
          that.getToken('https://api.feature12.dnevnik.ru/v2/firebase/dnevniktoken?access_token=' + token);
      }
    }

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
        $('#app').html('<div class="page">\n            <button class="auth-btn auth-btn-fb firebase-btn">\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Facebook</button><br>\n            <a href="https://oauth.vk.com/authorize?client_id=7097936&display=page&redirect_uri=' + (window.location.href + '?auth=vk') + '&scope=&response_type=token&v=5.5" class="auth-btn auth-btn-vk firebase-btn">\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Vk.com</a><br>\n            <a href=' + Auth.getLink() + ' class="auth-btn auth-btn-dn firebase-btn">\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 \u0414\u043D\u0435\u0432\u043D\u0438\u043A.\u0440\u0443</a>\n            <div class="list"></div>\n          </div>');
        that.getList();
      }
    });

    $('#app').on('click', '.auth-btn-fb', function () {
      firebase.auth().signInWithPopup(provider);
    });

    $('#app').on('click', '.auth-btn-dn', function () {
      Auth.auth();
    });

    $('#app').on('click', '.logout-btn', function () {
      var authType = Cookie.get('authType');

      Cookie.delete(appOptions.provider + '-' + authType + '_token');
      Cookie.delete('authType');
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
  },
  getToken: function getToken(url) {
    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify({}),
      dataType: 'json',
      success: function success(data) {
        // eslint-disable-next-line
        console.log(data);
        firebase.auth().signInWithCustomToken(data.token).then(function (user) {
          // eslint-disable-next-line
          console.log(user);
          var u = firebase.auth().currentUser;

          if (!u.displayName) {
            u.updateProfile({
              displayName: data.displayName,
              photoURL: data.photoURL
            });
          }
        }).catch(function (error) {
          // eslint-disable-next-line
          console.log(error);
        });
      },
      processData: false,
      type: 'POST',
      url: url
    });
  }
};

$('document').ready(function () {
  App.init();
});

}());
//# sourceMappingURL=app.js.map
