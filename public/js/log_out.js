"use strict";
const log_out_element = document.getElementById("log_out")
log_out_element.onclick = () => {
  document.cookie = "access_token=;max-age=0";
  if (window.location.pathname in ["/catalog"]) {
    window.location.reload();
  } else {
    window.location.assign("/login");
  }
};
