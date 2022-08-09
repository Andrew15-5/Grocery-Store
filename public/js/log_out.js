"use strict";
(() => {
  const log_out_element = document.getElementById("log_out");
  if (log_out_element) {
    log_out_element.onclick = () => {
      utils.remove_cookie("access_token");
      if (["/account"].indexOf(window.location.pathname) > -1) {
        window.location.assign("/login");
      } else {
        window.location.reload();
      }
    };
  }
})();
