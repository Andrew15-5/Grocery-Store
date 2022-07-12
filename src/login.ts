import { Request } from "express"
import { Response } from "express-serve-static-core/index"
import { path, pool } from "./utils"
import * as auth from "./utils/auth"
import { check_password } from "./utils/hash"

namespace login {
  export function get(reqest: Request, response: Response) {
    response.status(200)
    if (auth.is_user_authenticated(reqest)) {
      return response.redirect("/catalog")
    }
    response.sendFile(path.resolve("./public/login.html"))
  }

  export async function post(reqest: Request, response: Response) {
    const { username, password } = reqest.body

    try {
      const hash = await fetch_user_info(username)
      if (hash === null) return response.status(400).redirect("/login")

      const password_is_correct = await check_password(password, hash)
      if (!password_is_correct) return response.status(400).redirect("/login")
    }
    catch (error) {
      throw error
    }

    auth.authenticate_user(username, response).status(200).redirect("/catalog")
  }

  async function fetch_user_info(username: string) {
    const response = await pool.query(
      "SELECT password FROM users WHERE username = $1;", [username])
    if (response.rowCount === 0) return null
    return response.rows[0].password
  }
}

export default login
