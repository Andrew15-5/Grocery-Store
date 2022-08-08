import utils from "./utils"
import { pool, Request, Response } from "./utils"
import auth from "./utils/auth"
import hash from "./utils/hash"

namespace registration {
  export async function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    response.status(200)
    if (auth.is_user_authenticated(request) &&
      await auth.is_user_exist(request)) {
      return response.redirect(utils.get_redirect_url(request))
    }
    auth.deauthenticate_user(response).render("registration.hbs", { theme })
  }

  export async function post(request: Request, response: Response) {
    const { username, password, repeat_password } = request.body

    if (typeof username !== "string" ||
      typeof password !== "string" ||
      typeof repeat_password !== "string") {
      return response.status(400).redirect("/registration")
    }

    if (!validate_username_and_password(
      username, password, repeat_password, request, response)) return

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

    auth
      .authenticate_user(username, response)
      .status(200)
      .redirect(utils.get_redirect_url(request))
  }

  function validate_username_and_password(username: string, password: string, repeat_password: string, request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    let username_error = null
    let password_error = null
    let error_occured = false

    if (!utils.username.is_valid(username)) {
      error_occured = true
      username_error = utils.username.validation_error(username)
    }

    if (!utils.password.is_valid(password)) {
      error_occured = true
      password_error = utils.password.validation_error(password)
    }

    if (password !== repeat_password) {
      error_occured = true
      password_error = "Пароли не совпадают"
    }

    if (error_occured) {
      let link_wrapper = false
      if (password_error && /^<a>/.test(password_error)) {
        password_error = password_error.slice(3)
        link_wrapper = true
      }
      response.status(400).render("registration.hbs", {
        username_error,
        password_error,
        link_wrapper,
        theme
      })
      return false
    }
    return true
  }
}

export default registration
