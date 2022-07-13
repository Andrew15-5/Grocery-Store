import { path, pool, Request, Response } from "./utils"
import * as auth from "./utils/auth"
import { generate_hash } from "./utils/hash"

namespace registration {
  export function get(request: Request, response: Response) {
    response.status(200)
    if (auth.is_user_authenticated(request)) {
      return response.redirect("/catalog")
    }
    response.sendFile(path.resolve("./public/registration.html"))
  }

  export async function post(request: Request, response: Response) {
    const { username, password, repeat_password } = request.body

    if (typeof username !== "string" ||
      typeof password !== "string" ||
      typeof repeat_password !== "string" ||
      password !== repeat_password ||
      !is_username_valid(username) ||
      !is_password_valid(password)) {
      return response.status(400).redirect("/registration")
    }

    try {
      const query_response = await pool.query("SELECT username FROM users;")
      for (const row of query_response.rows) {
        if (row.username === username) {
          return response.status(400).redirect("/registration")
        }
      }

      const hash = await generate_hash(password)
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2);",
        [username, hash])
    }
    catch (error) {
      response.status(500).redirect("/registration")
      throw error
    }

    auth.authenticate_user(username, response).status(200).redirect("/catalog")
  }

  function is_username_valid(password: string) {
    const allowed_charset_and_length_restriction = /^[a-zA-Z0-9._-]{1,20}$/
    if (allowed_charset_and_length_restriction.test(password)) return true
    return false
  }

  function is_password_valid(password: string) {
    // Allow any visible ASCII character; length must be in [10;1000]
    const allowed_charset_and_length_restriction = /^[ -~]{10,1000}$/
    const includes_letters = /[a-z]+/
    const includes_LETTERS = /[A-Z]+/
    const includes_digits = /[0-9]+/
    if (allowed_charset_and_length_restriction.test(password) &&
      includes_letters.test(password) &&
      includes_LETTERS.test(password) &&
      includes_digits.test(password)) return true
    return false
  }
}

export default registration
