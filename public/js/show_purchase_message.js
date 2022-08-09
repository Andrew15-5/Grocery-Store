"use strict";
(() => {
  const cookies = utils.parse_cookies();
  const message = cookies["alert_message"];
  if (message) {
    setTimeout(() => alert(decodeURI(message)), 400);
    utils.remove_cookie("alert_message");
  }
})();
