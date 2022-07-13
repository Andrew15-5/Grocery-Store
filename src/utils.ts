import { Request } from "express"
import { Response } from "express-serve-static-core/index"
import path from "path"
import { Pool } from "pg"

export { path, Request, Response }

export const pool = new Pool()

export function make_sure_all_env_vars_are_set() {
  const env_vars: string[] = [
    "PEPPER",
    "JWT_SECRET_KEY"
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

export function is_username_valid(password: string) {
  const allowed_charset_and_length_restriction = /^[a-zA-Z0-9._-]{1,20}$/
  if (allowed_charset_and_length_restriction.test(password)) return true
  return false
}

export function is_password_valid(password: string) {
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
