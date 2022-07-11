import { Response, Request } from "express"
import jwt from "jsonwebtoken"

export function authenticate_user(response: Response): Response {
  return response
}

export function deauthenticate_user(response: Response): Response {
  response.clearCookie("access_token")
  return response
}

export function is_user_authenticated(request: Request): boolean {
  if (!("access_token" in request.cookies)) return false
  const access_token = request.cookies.access_token
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY as string);
  } catch (error) { 
    return false 
  }
  return true
}
