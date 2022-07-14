"use strict";
const log_out_element = document.getElementById("log_out")
log_out_element.onclick = () => {
  document.cookie = "access_token=;Max-Age=0"
  window.location.reload()
};
