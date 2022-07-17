"use strict";
class utils {
  static parse_cookies() {
    const cookie_list = document.cookie.split("; ");
    const cookies = {};
    for (const cookie of cookie_list) {
      const key_value = cookie.split('=');
      const key = key_value[0];
      const value = key_value[1];
      cookies[key] = value;
    }
    return cookies;
  }
  static remove_cookie(cookie) {
    document.cookie = cookie + "=;max-age=0;path=/";
  }
  static init_theme_change() {
    let current_theme = localStorage.getItem("theme");
    if (!current_theme) {
      current_theme = "dark";
      localStorage.setItem("theme", current_theme);
    }
    const theme_element = document.getElementById("theme");
    document.getElementById("change-theme").onclick = () => {
      current_theme = (current_theme === "dark") ? "light" : "dark";
      localStorage.setItem("theme", current_theme);
      theme_element.setAttribute("href", `./css/${current_theme}-theme.css`);
    }
  }
}
