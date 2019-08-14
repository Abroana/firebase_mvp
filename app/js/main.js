// @ts-nocheck
/* global firebase */

const App = {
  init() {
    const that = this
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
            <div class="page__subtitle">Оставьте след в истории:</div>
            <input class="page__input">
            <button class="send firebase-btn">Отправить</button>
            <div class="list"></div>
          </div>
        `

        $('#app').html(html)
        that.getList()
      } else {
        $('#app').html('<button class="auth-btn firebase-btn">Войти</button>')
      }
    })

    $('#app').on('click', '.auth-btn', function() {
      firebase.auth().signInWithPopup(provider)
    })

    $('#app').on('click', '.logout-btn', function() {
      firebase.auth().signOut()
    })

    $('#app').on('click', '.send', function() {
      const val = $('.page__input').val()

      if (val.length) {
        $('.page__input').val('')
        that.database
          .collection('sandbox')
          .add({
            user: firebase.auth().currentUser.uid,
            text: val,
            created: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(function(docRef) {
            // eslint-disable-next-line
            console.log('Document written with ID: ', docRef.id)
            that.getList()
          })
          .catch(function(error) {
            // eslint-disable-next-line
            console.error('Error adding document: ', error)
          })
      }
    })

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
  },

  getList() {
    this.database
      .collection('sandbox')
      .orderBy('created', 'desc')
      .get()
      .then(querySnapshot => {
        const list = querySnapshot.docs.map(
          item =>
            `<div class="item">${item.data().text}${
              item.data().user === firebase.auth().currentUser.uid
                ? `<span
                  class="item__remove"
                  data-id="${item.id}"
                >
                  +
                </span>`
                : ''
            }</div>`
        )

        $('.list').html(list.join(''))
      })
  }
}

$('document').ready(function() {
  App.init()
})
