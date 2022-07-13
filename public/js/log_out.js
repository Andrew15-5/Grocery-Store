"use strict";
const log_out_element = document.getElementById("log_out")
if (log_out_element === null) {
  throw Error("Log out tag was removed");
}
log_out_element.onclick = () => {
  document.cookie = "access_token=;expires=" + new Date(0).toUTCString()
  window.location.assign("/login")
};
