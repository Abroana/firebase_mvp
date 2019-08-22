import Cookie from './cookie'
import appOptions from './settings'

export var Auth = {
  token: undefined,
  authType: '',

  auth(callback) {
    const that = this

    function getToken() {
      const token = /access_token=([-0-9a-zA-Z_]+)/.exec(window.location.hash) || []
      const code = /code=([-0-9a-zA-Z_]+)/.exec(window.location.search) || []
      const authType = /auth=([-0-9a-zA-Z_]+)/.exec(window.location.search) || []

      that.authType = authType[1]
      Cookie.set('authType', authType[1])

      return token[1] || code[1]
    }
    const token = Cookie.get(`${appOptions.provider}_token`) || getToken()

    if (undefined !== token) {
      const authType = this.authType || Cookie.get('authType')

      Cookie.delete(`${appOptions.provider}-${authType}_token`)
      Cookie.set(`${appOptions.provider}-${authType}_token`, token)
      this.token = token
      if (typeof callback === 'function') {
        callback()
      }
    } else {
      const error = /error=([-0-9a-zA-Z_]+)/.exec(window.location.hash) || []

      if (undefined !== error[1]) {
        Cookie.delete(`${appOptions.provider}_token`)
        this.token = undefined
      }
    }
  },
  getLink() {
    return `${appOptions.authUrl}?response_type=token&client_id=${appOptions.clientId}&scope=${
      appOptions.scope
    }&redirect_uri=${appOptions.redirectUrl}`
  }
}
