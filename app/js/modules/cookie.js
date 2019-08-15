export default {
  get(name) {
    const matches = window.parent.document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1')}=([^;]*)`));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  set(name, value, options = {}) {
    let expires = options.expires;
    const cookieOption = options;
    let updatedCookie;
    var d = new Date();

    if (typeof expires === 'number' && expires) {
      d.setTime(d.getTime() + (expires * 1000));
      expires = d;
    } else {
      expires = new Date(d.getTime() + (14 * 24 * 60 * 60 * 1000));
    }
    if (expires && expires.toUTCString) {
      expires = expires.toUTCString();
      cookieOption.expires = expires;
    }
    var cookieValue = encodeURIComponent(value);
    
    updatedCookie = `${name}=${cookieValue}`;
    Object.keys(cookieOption).forEach((propName) => {
      updatedCookie += `; ${propName}`;
      var propValue = cookieOption[propName];

      if (propValue !== true) {
        updatedCookie += `=${propValue}`;
      }
    });
    window.parent.document.cookie = updatedCookie;
  },

  delete(name) {
    this.set(name, '', { expires: -1 });
  },
};
