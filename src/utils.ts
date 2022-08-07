import { NextFunction, Request } from "express"
import { Response } from "express-serve-static-core/index"
import fetch from "node-fetch"
import path from "path"
import { Pool, QueryResult } from "pg"

import auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

export { fetch, path, QueryResult, Request, Response }

export const pool = new Pool()

namespace utils {
  export function make_sure_all_env_vars_are_set() {
    const env_vars: string[] = [
      "JWT_SECRET_KEY",
      "PEPPER",
      "PGDATABASE",
      "PGHOST",
      "PGPASSWORD",
      "PGPORT",
      "PGUSER",
      "REF_APP_SERVER_PORT",
      "SERVER_PORT"
    ]
    let error_occured = false
    for (const env_var of env_vars) {
      if (process.env[env_var] === undefined) {
        process.stderr.write(`Environment variable ${env_var} is not set\n`)
        error_occured = true
      }
    }
    if (error_occured) process.exit(1)
  }

  const string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

  function generate_random_string(length: number, charset: string) {
    let string = ""
    for (let i = 0; i < length; i++) {
      string += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return string
  }

  export async function generate_new_referral_id() {
    const query = await pool.query("SELECT * FROM users;")
    const list = query.rows

    let new_referral_id = '-' + generate_random_string(8, string)
    while (list.indexOf(new_referral_id) > -1) {
      new_referral_id = '-' + generate_random_string(8, string)
    }
    return new_referral_id
  }

  export namespace username {
    const max_length = 20
    const allowed_length_restriction = new RegExp(`^.{1,${max_length}}$`, 's')
    const allowed_charset_and_length_restriction =
      new RegExp(`^[a-zA-Z0-9._-]{1,${max_length}}$`)

    export function is_valid(username: string) {
      return allowed_charset_and_length_restriction.test(username)
    }

    export function validation_error(username: string) {
      if (!allowed_length_restriction.test(username)) {
        return `Длина должна быть в диапазоне [1;${max_length}]`
      }
      if (!allowed_charset_and_length_restriction.test(username)) {
        return "Использовать можно только разрешённые символы"
      }
      return null
    }
  }

  export namespace password {
    const min_length = 10
    const max_length = 1000
    const allowed_length_restriction =
      new RegExp(`^.{${min_length},${max_length}}$`, 's')
    // Allow any visible ASCII character
    const allowed_charset_and_length_restriction =
      new RegExp(`^[ -~]{${min_length},${max_length}}$`)
    const includes_letters = /[a-z]+/
    const includes_LETTERS = /[A-Z]+/
    const includes_digits = /[0-9]+/

    export function is_valid(password: string) {
      return (allowed_charset_and_length_restriction.test(password) &&
        includes_letters.test(password) &&
        includes_LETTERS.test(password) &&
        includes_digits.test(password))
    }

    export function validation_error(password: string) {
      if (!allowed_length_restriction.test(password)) {
        console.log(password, password.length)
        return `Длина должна быть в диапазоне [${min_length};${max_length}]`
      }
      if (!allowed_charset_and_length_restriction.test(password)) {
        return "<a>Использовать можно только символы ASCII с №32 ( ) по №126 (~)"
      }
      let not_included = []
      if (!includes_letters.test(password)) {
        not_included.push("латинские буквы нижнего регистра (a-z)")
      }
      if (!includes_LETTERS.test(password)) {
        not_included.push("латинские буквы верхнего регистра (A-Z)")
      }
      if (!includes_digits.test(password)) {
        not_included.push("цифры (0-9)")
      }
      if (not_included.length) {
        return "Отсутствуют следующие символы: " + not_included.join(', ')
      }
      return null
    }
  }

  export async function process_referral_purchase(purchase_uuid: string, referral_id: string):
    Promise<{
      error_message?: string
    }> {
    const REF_APP_SERVER_PORT = process.env.REF_APP_SERVER_PORT as string
    const get_referral_id_url =
      `http://localhost:${REF_APP_SERVER_PORT}/process-purchase`

    const parameters = new URLSearchParams()
    parameters.append("purchase_uuid", purchase_uuid)
    parameters.append("referral_id", referral_id)

    try {
      const response = await fetch(get_referral_id_url, {
        method: "POST",
        body: parameters
      })
      if (response.status === 200) return {}
    }
    catch (e) { }
    return { error_message: "Ошибка работы сервиса реферальных ссылок." }
  }

  export async function purchase_product(request: Request, response: Response, product_uri: string) {
    const { ref } = request.query

    const username = auth.get_username(request)
    if (!username) return response.status(401).redirect("/login")
    if (!product_uri) return response.status(400).redirect(request.url)

    let query: QueryResult<any>

    try {
      query = await fetch_data.user("username", username, "uuid")
      const user_uuid = query.rows[0].uuid

      query = await fetch_data.product("uri", product_uri, "uuid, name")
      if (query.rowCount === 0) {
        response.status(400).redirect(request.url)
      }
      const product_uuid = query.rows[0].uuid
      const product_name = query.rows[0].name

      query = await pool.query(
        "INSERT INTO purchases (user_uuid, product_uuid) \
        VALUES ($1, $2) RETURNING uuid",
        [user_uuid, product_uuid])
      const purchase_uuid = query.rows[0].uuid

      if (ref) {
        const { error_message } =
          await process_referral_purchase(purchase_uuid, ref as string)
        if (error_message) response.cookie("error_message", error_message)
      }

      response.cookie("alert_message", `Вы приобрели ${product_name}`)
    }
    catch (error) {
      response.status(500).redirect(request.url)
      throw error
    }

    response.status(200).redirect(request.url)
  }

  export function get_current_theme(request: Request) {
    return request.cookies.theme || "light"
  }

  export function get_redirect_url(request: Request) {
    const default_value = "/catalog"
    const { referrer } = request.query
    if (!referrer) return default_value
    return decodeURIComponent(referrer as string)
  }

  // Middleware
  export function update_theme_cookie(request: Request, response: Response, next: NextFunction) {
    const theme = request.cookies.theme || "light"
    response.cookie("theme", theme, { expires: new Date("9999") })
    next()
  }
}

export default utils
