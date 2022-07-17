import utils from "./utils"
import { path, Request, Response } from "./utils"
import * as auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"
import { check_password } from "./utils/hash"

namespace login {
  export function get(request: Request, response: Response) {
    response.status(200)
    if (auth.is_user_authenticated(request)) {
      return response.redirect("/catalog")
    }
    response.sendFile(path.resolve("./public/login.html"))
  }

  export async function post(request: Request, response: Response) {
    const { username, password } = request.body
    let { log_out_on_session_end } = request.body

    if (typeof username !== "string" ||
      typeof password !== "string" ||
      (typeof log_out_on_session_end !== "string" &&
        typeof log_out_on_session_end !== "undefined") ||
      !utils.is_username_valid(username) ||
      !utils.is_password_valid(password)) {
      return response.status(400).redirect("/login")
    }

    log_out_on_session_end = (log_out_on_session_end === "on")

    try {
      const hash = await fetch_password(username)
      if (hash === null) return response.status(400).redirect("/login")

      const password_is_correct = await check_password(password, hash)
      if (!password_is_correct) return response.status(400).redirect("/login")
    }
    catch (error) {
      response.status(500).redirect("/login")
      throw error
    }

    auth.authenticate_user(username, response, log_out_on_session_end)
      .status(200).redirect("/catalog")
  }

  async function fetch_password(username: string) {
    const response = await fetch_data.user("username", username, "password")
    if (response.rowCount === 0) return null
    return response.rows[0].password
  }
}

export default login
