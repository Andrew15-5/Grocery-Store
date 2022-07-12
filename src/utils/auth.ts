import { Response, Request } from "express"
import jwt from "jsonwebtoken"

export function authenticate_user(username: string, response: Response): Response {
  const user = { name: username }

  //encrypting the user name by secret key
  const access_token = jwt.sign(user, process.env.JWT_SECRET_KEY as string)

  return response.cookie("access_token", access_token, {
    maxAge: 1000 * 60 * 60 * 24 * 7
  })
}

export function deauthenticate_user(response: Response): Response {
  return response.clearCookie("access_token")
}

export function is_user_authenticated(request: Request): boolean {
  if (!("access_token" in request.cookies)) return false
  const access_token = request.cookies.access_token
  try {
    jwt.verify(access_token, process.env.JWT_SECRET_KEY as string)
  } catch (error) {
    return false
  }
  return true
}
