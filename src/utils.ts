import { Request } from "express"
import { Response } from "express-serve-static-core/index"
import path from "path"
import { Pool } from "pg"

export { path, Pool, Request, Response }

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
