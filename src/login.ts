import utils from "./utils"
import { Request, Response } from "./utils"
import auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"
import hash from "./utils/hash"

namespace login {
  export async function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    response.status(200)
    if (auth.is_user_authenticated(request) &&
      await auth.is_user_exist(request)) {
      return response.redirect(utils.get_redirect_url(request))
    }
    auth.deauthenticate_user(response).render("login.hbs", { theme })
  }

  export async function post(request: Request, response: Response) {
    const { username, password } = request.body
    let { log_out_on_session_end } = request.body

    if (typeof username !== "string" ||
      typeof password !== "string" ||
      (typeof log_out_on_session_end !== "string" &&
        typeof log_out_on_session_end !== "undefined")) {
      return response.status(400).redirect("/login")
    }

    if (!validate_username_and_password(username, password, response)) return

    log_out_on_session_end = (log_out_on_session_end === "on")

    try {
      const hashed_password = await fetch_password(username)
      if (hashed_password === null) {
        return incorrect_username_or_password(request, response)
      }

      const password_is_correct =
        await hash.check_password(password, hashed_password)
      if (!password_is_correct) {
        return incorrect_username_or_password(request, response)
      }
    }
    catch (error) {
      response.status(500).redirect("/login")
      throw error
    }

    auth
      .authenticate_user(username, response, log_out_on_session_end)
      .status(200)
      .redirect(utils.get_redirect_url(request))
  }

  async function fetch_password(username: string) {
    const response = await fetch_data.user("username", username, "password")
    if (response.rowCount === 0) return null
    return response.rows[0].password
  }

  function validate_username_and_password(username: string, password: string, response: Response) {
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

    if (error_occured) {
      let link_wrapper = false
      if (password_error && /^<a>/.test(password_error)) {
        password_error = password_error.slice(3)
        link_wrapper = true
      }
      response.status(400).render("login.hbs", {
        username_error,
        password_error,
        link_wrapper
      })
      return false
    }
    return true
  }

  function incorrect_username_or_password(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    return response.status(400).render("login.hbs", {
      username_error: "Неверный логин или пароль",
      theme
    })
  }
}

export default login
