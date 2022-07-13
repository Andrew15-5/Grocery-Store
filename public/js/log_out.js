"use strict";
const log_out_element = document.getElementById("log_out")
log_out_element.onclick = () => {
  document.getElementById("log_out").id = "log_in"
  document.cookie = "access_token=;Max-Age=0"
  window.location.assign("/catalog")
};
