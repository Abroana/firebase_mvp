var isMobile = (function() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true
  }

  return false
})()

const appOptions = {
  authUrl: 'https://login.feature12.dnevnik.ru/oauth2',
  grantUrl: 'https://api.feature12.dnevnik.ru/v1/authorizations',
  scope: 'CommonInfo',
  clientId: 'cebd34d2c9b9442788135f71d731fdaf',
  redirectUrl: `${window.location.origin}${window.location.pathname}?auth=dn`,
  provider: 'firebase',
  api: 'https://api.feature12.dnevnik.ru/v1/',
  apiMobile: 'https://api.feature12.dnevnik.ru/modile/v1/',
  isMobile: isMobile,
  userLink: 'https://feature12.dnevnik.ru/user/user.aspx?user=',
  cdnPath: 'https://ad.csfeature12.dnevnik.ru/special/staging/petsforever/img/',
  cdnMain: 'https://ad.csfeature12.dnevnik.ru/special/staging/petsforever/',
  origin: '.feature12.dnevnik.ru',
  admins: [
    '1000006315838',
    '1000006435101',
    '1000004681017',
    '1000004934922',
    '1000005435557',
    '1000008630961',
    '1000003565717'
  ]
}

export default appOptions
