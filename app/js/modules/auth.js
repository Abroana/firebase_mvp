import Cookie from './cookie'
import appOptions from './settings'

export var Auth = {
  token: undefined,
  auth(callback) {
    var token

    function getToken() {
      token = /access_token=([-0-9a-zA-Z_]+)/.exec(window.location.hash) || []

      return token[1]
    }
    token = Cookie.get(`${appOptions.provider}_token`) || getToken()
    if (undefined !== token) {
      Cookie.delete(`${appOptions.provider}_token`)
      Cookie.set(`${appOptions.provider}_token`, token)
      this.token = token
      if (typeof callback === 'function') {
        callback()
      }
    } else {
      const error = /error=([-0-9a-zA-Z_]+)/.exec(window.location.hash) || []

      if (undefined !== error[1]) {
        Cookie.delete(`${appOptions.provider}_token`)
        this.token = undefined
      } else {
        window.location.href = `${appOptions.authUrl}?response_type=token&client_id=${
          appOptions.clientId
        }&scope=${appOptions.scope}&redirect_uri=${appOptions.redirectUrl}`
      }
    }
  }
}
