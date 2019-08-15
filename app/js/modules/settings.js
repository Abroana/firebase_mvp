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
  authUrl: 'https://login.dnevnik.ru/oauth2',
  grantUrl: 'https://api.dnevnik.ru/v1/authorizations',
  scope: 'CommonInfo',
  clientId: 'c2eb1c41dac14f98883add55494b9cf9',
  redirectUrl: window.location.href + '?auth=true',
  provider: 'firebase',
  api: 'https://api.dnevnik.ru/v1/',
  apiMobile: 'https://api.dnevnik.ru/modile/v1/',
  isMobile: isMobile,
  userLink: 'https://dnevnik.ru/user/user.aspx?user=',
  cdnPath: 'https://ad.csdnevnik.ru/special/staging/petsforever/img/',
  cdnMain: 'https://ad.csdnevnik.ru/special/staging/petsforever/',
  origin: '.dnevnik.ru',
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
