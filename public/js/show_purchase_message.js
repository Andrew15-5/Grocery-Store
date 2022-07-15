"use strict";
const cookies = utils.parse_cookies();
const message = cookies["alert_message"];
if (message) {
  alert(decodeURI(message));
  document.cookie = "alert_message=;max-age=0";
}
