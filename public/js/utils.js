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
  static update_cookie(name, value, date) {
    let cookie = `${name}=${value}`
    if (date) cookie += ";expires=" + date.toUTCString()
    document.cookie = cookie + ";path=/";
  }
  static init_theme_change() {
    const theme_element = document.getElementById("theme");
    let current_theme = this.parse_cookies()["theme"]
    document.getElementById("change-theme").onclick = () => {
      current_theme = (current_theme === "dark") ? "light" : "dark";
      this.update_cookie("theme", current_theme, new Date("9999"))
      theme_element.setAttribute("href", `./css/${current_theme}-theme.css`);
    }
  }
}
