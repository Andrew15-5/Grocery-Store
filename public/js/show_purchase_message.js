"use strict";
const cookies = utils.parse_cookies();
const message = cookies["alert_message"];
if (message) {
  alert(decodeURI(message));
  utils.remove_cookie("alert_message");
}
