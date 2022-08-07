"use strict";
var cookies = utils.parse_cookies();
var message = cookies["alert_message"];
if (message) {
  setTimeout(() => alert(decodeURI(message)), 400);
  utils.remove_cookie("alert_message");
}
