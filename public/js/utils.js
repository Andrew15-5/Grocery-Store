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
}
