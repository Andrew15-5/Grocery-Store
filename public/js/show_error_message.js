"use strict";
var cookies = utils.parse_cookies();
var message = cookies["error_message"];
if (message) {
  setTimeout(() => alert(decodeURI(message)), 500);
  utils.remove_cookie("error_message");
}
