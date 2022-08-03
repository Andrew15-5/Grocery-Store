import utils from "./utils"
import { pool, Request, Response } from "./utils"
import auth from "./utils/auth"
import hash from "./utils/hash"

namespace registration {
  export function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    response.status(200)
    if (auth.is_user_authenticated(request)) {
      return response.redirect("/catalog")
    }
    response.render("registration.hbs", { theme })
  }

  export async function post(request: Request, response: Response) {
    const { username, password, repeat_password } = request.body

    if (typeof username !== "string" ||
      typeof password !== "string" ||
      typeof repeat_password !== "string" ||
      password !== repeat_password ||
      !utils.is_username_valid(username) ||
      !utils.is_password_valid(password)) {
      return response.status(400).redirect("/registration")
    }

    try {
      const query_response = await pool.query("SELECT username FROM users;")
      for (const row of query_response.rows) {
        if (row.username === username) {
          return response.status(400).redirect("/registration")
        }
      }

      const hashed_password = await hash.generate_hash(password)
      const referral_id = await utils.generate_new_referral_id()
      await pool.query(
        "INSERT INTO users (username, password, referral_id) \
        VALUES ($1, $2, $3);", [username, hashed_password, referral_id])
    }
    catch (error) {
      response.status(500).redirect("/registration")
      throw error
    }

    auth.authenticate_user(username, response).status(200).redirect("/catalog")
  }
}

export default registration
