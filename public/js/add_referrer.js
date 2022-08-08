"use strict";
var params = {};
if (document.location.search) {
  params = utils.parse_search(document.location.search)
}

var array = ["/login", "/registration"]
if (array.indexOf(window.location.pathname) > -1 &&
  document.referrer &&
  !params["referrer"]) {

  let new_url = `${window.location.pathname}?referrer=`
  const referrer_url = new URL(document.referrer);
  const referrer_search = referrer_url.search;

  const referrer_params = utils.parse_search(referrer_search)
  if (referrer_params["referrer"]) {
    new_url += encodeURIComponent(decodeURIComponent(
      referrer_params["referrer"]))
    history.pushState(null, '', new_url)
  } else {

    const referrer_pathname = referrer_url.pathname;
    if (array.indexOf(referrer_pathname) === -1) {
      new_url += encodeURIComponent(decodeURIComponent(
        `${referrer_pathname}${referrer_search}`))
      history.pushState(null, '', new_url)
    }
  }
}
