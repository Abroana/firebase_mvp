// @ts-nocheck
/* global firebase */
import { Auth } from './modules/auth.js'

const App = {
  init() {
    const that = this

    if (document.location.href.indexOf('access_token') > -1) {
      Auth.auth(function() {
        var path = window.location.pathname.substring(0, window.location.pathname.length)

        history.pushState('', document.title, path)
      })
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
            <div class="page__title">Добро пожаловать, ${user.displayName}!</div>
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
        that.getList()
      } else {
        $('#app').html(
          `<div class="page">
            <button class="auth-btn auth-btn-fb firebase-btn">Войти через Facebook</button><br>
            <button class="auth-btn auth-btn-dn firebase-btn">Войти через Дневник.ру</button>
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
  }
}

$('document').ready(function() {
  App.init()
})
