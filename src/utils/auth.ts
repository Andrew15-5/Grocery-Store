import { Response, Request } from "express"

export function authenticate_user(response: Response): Response {
  return response
}

export function deauthenticate_user(response: Response): Response {
  return response
}

export function is_user_authenticated(request: Request): boolean {
  return true
}
