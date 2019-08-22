// @ts-nocheck
/* global firebase */
import { Auth } from './modules/auth.js'
import Cookie from './modules/cookie.js'
import appOptions from './modules/settings.js'

const App = {
  init() {
    const that = this

    if (
      document.location.href.indexOf('access_token') > -1 ||
      document.location.href.indexOf('code') > -1
    ) {
      Auth.auth(function() {
        const path = window.location.pathname.substring(0, window.location.pathname.length)

        history.pushState('', document.title, path)
      })
    }

    const authType = Cookie.get('authType')
    const token = Cookie.get(`${appOptions.provider}-${authType}_token`)

    if (token) {
      switch (authType) {
        case 'vk':
          that.getToken(
            `https://api.feature12.dnevnik.ru/v1/firebase/token/vk?vkToken=${token}&lang=ru`
          )
          break
        case 'dn':
          that.getToken(
            `https://api.feature12.dnevnik.ru/v1/firebase/token/dk?access_token=${token}`
          )
          break
        case 'ok':
          that.getToken(
            `https://api.feature12.dnevnik.ru/v1/firebase/token/ok?okCode=${token}&redirectUri=${
              window.location.href
            }?auth=ok`
          )
          break
      }
    }

    const firebaseConfig = {
      apiKey: 'AIzaSyCmEjhSDdqEsmIdxe9VN4GI7IxTD2LhU4I',
      authDomain: 'testproject-48d5e.firebaseapp.com',
      databaseURL: 'https://testproject-48d5e.firebaseio.com',
      projectId: 'testproject-48d5e',
      storageBucket: 'testproject-48d5e.appspot.com',
      messagingSenderId: '121120459695',
      appId: '1:121120459695:web:e8ecc54371f88ce6'
    }

    firebase.initializeApp(firebaseConfig)
    this.database = firebase.firestore()
    this.storageService = firebase.storage()
    this.storageRef = this.storageService.ref()

    const provider = new firebase.auth.FacebookAuthProvider()

    provider.setCustomParameters({
      display: 'popup'
    })

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const html = `
          <div class="header">
            <button class="logout-btn firebase-btn">Выйти</button>
          </div>
          <div class="page">
            <div class="page__title"></div>
            <div class="page__subtitle">Выберите файл для загрузки:</div>
            <div id="filesubmit">
              <input type="file" class="file-select" accept="image/*"/>
              <div class="placeholder"></div>
              <div class="msg"></div>
              <button class="send firebase-btn">Отправить</button>
            </div>
            
            <div class="list"></div>
          </div>
        `

        $('#app').html(html)
        that.drawUser()
        that.getList()
      } else {
        $('#app').html(
          `<div class="page">
            <button class="auth-btn auth-btn-fb firebase-btn">Войти через Facebook</button><br>
            <a href="https://oauth.vk.com/authorize?client_id=7097936&display=page&redirect_uri=${`${
    window.location.href
  }?auth=vk`}&scope=&response_type=token&v=5.5" class="auth-btn auth-btn-vk firebase-btn">Войти через Vk.com</a><br>
            <a href="https://connect.ok.ru/oauth/authorize?client_id=1281062144&scope=&response_type=code&redirect_uri=${
  window.location.href
}?auth=ok" class="auth-btn auth-btn-vk firebase-btn">Войти через Одноклассники</a><br>
            <a href=${Auth.getLink()} class="auth-btn auth-btn-dn firebase-btn">Войти через Дневник.ру</a>
            <div class="list"></div>
          </div>`
        )
        that.getList()
      }
    })

    $('#app').on('click', '.auth-btn-fb', function() {
      firebase.auth().signInWithPopup(provider)
    })

    $('#app').on('click', '.auth-btn-dn', function() {
      Auth.auth()
    })

    $('#app').on('click', '.logout-btn', function() {
      const authType = Cookie.get('authType')

      Cookie.delete(`${appOptions.provider}-${authType}_token`)
      Cookie.delete('authType')
      firebase.auth().signOut()
    })

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

    $('#app').on('click', '.item__remove', function() {
      that.database
        .collection('sandbox')
        .doc($(this).data('id'))
        .delete()
        .then(() => {
          $(this)
            .parent()
            .remove()
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error('Error removing document: ', error)
        })
    })

    let selectedFile

    $('#app').on('click', '.placeholder', function() {
      $('.file-select').click()
    })

    $('#app').on('change', '.file-select', function(e) {
      selectedFile = e.target.files[0]
      $('.placeholder').html(
        `<img src="${URL.createObjectURL(e.target.files[0])}" class="placeholder__img">`
      )
    })

    $('#app').on('click', '.send', function() {
      const uploadTask = that.storageRef.child(`images/${selectedFile.name}`).put(selectedFile) // create a child directory called images, and place the file inside this directory

      uploadTask.on(
        'state_changed',
        snapshot => {
          // eslint-disable-next-line
          console.log(snapshot)
        },
        error => {
          // eslint-disable-next-line
          console.log(error)
        },
        () => {
          $('.placeholder').empty()
          $('.msg').html('Изображение загружено')
          that.getList()
        }
      )
    })
  },

  getList() {
    const that = this
    var listRef = this.storageRef.child('images')

    $('.list').empty()
    listRef
      .listAll()
      .then(res => {
        res.items.map(item => {
          that.storageService
            .ref(item.fullPath)
            .getDownloadURL()
            .then(url => {
              $('.list').append(`
                <img class="list__item" src="${url}">`)
            })
        })
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.error(error)
      })
  },

  getToken(url) {
    const that = this

    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify({}),
      dataType: 'json',
      success: function(data) {
        // eslint-disable-next-line
        console.log(data)
        firebase
          .auth()
          .signInWithCustomToken(data.token)
          .then(user => {
            // eslint-disable-next-line
            console.log(user)
            const u = firebase.auth().currentUser

            if (!u.displayName) {
              u.updateProfile({
                displayName: data.displayName,
                photoURL: data.photoURL
              }).then(() => {
                that.drawUser()
              })
            }
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error)
          })
      },
      processData: false,
      type: 'POST',
      url: url
    })
  },

  drawUser() {
    const user = firebase.auth().currentUser

    if (user.displayName) {
      $('.page__title').html(`Добро пожаловать, ${user.displayName}!`)
    }
  }
}

$('document').ready(function() {
  App.init()
})
