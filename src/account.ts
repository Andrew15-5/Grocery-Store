import { pool, Request, Response } from "./utils"
import * as auth from "./utils/auth"

namespace account {
  export async function get(request: Request, response: Response) {
    try {
      const username = auth.get_username(request)
      if (!username) return response.status(401).redirect("/login")
      const query_response = await pool.query(
        "SELECT * FROM users WHERE username = $1;", [username])
      response.status(200).render("account.hbs", {
        username: query_response.rows[0].username
      })
    }
    catch (error) {
      response.status(500).redirect("/catalog")
      throw error
    }
  }
}

export default account
