"use strict";
const log_out_element = document.getElementById("log_out")
if (log_out_element) {
  log_out_element.onclick = () => {
    utils.remove_cookie("access_token");
    if (["/catalog"].indexOf(window.location.pathname) > -1) {
      window.location.reload();
    } else {
      window.location.assign("/login");
    }
  };
}
