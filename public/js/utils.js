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
    let cookie = `${name}=${value}`;
    if (date) cookie += ";expires=" + date.toUTCString();
    document.cookie = cookie + ";path=/";
  }

  static apply_theme(theme, theme_element) {
    let prefix = '';
    if (/^\/product\/[a-zA-Z0-9]+/.test(window.location.pathname)) {
      prefix = '.';
    }
    if (theme_element) theme_element.setAttribute(
      "href", `${prefix}./css/${theme}-theme.css`);
  }

  static init_theme_change() {
    const theme_element = document.getElementById("theme");
    const change_theme_element = document.getElementById("change-theme");
    let current_theme = this.parse_cookies()["theme"];
    if (change_theme_element) {
      change_theme_element.onclick = () => {
        current_theme = (current_theme === "dark") ? "light" : "dark";
        this.update_cookie("theme", current_theme, new Date("9999"));
        this.apply_theme(current_theme, theme_element);
      }
    } else {
      console.log('Невозможно использовать кнопку "Изменить тему"');
    }
  }
}
