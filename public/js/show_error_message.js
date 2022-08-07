"use strict";
var cookies = utils.parse_cookies();
var message = cookies["error_message"];
if (message) {
  alert(decodeURI(message));
  utils.remove_cookie("error_message");
}
