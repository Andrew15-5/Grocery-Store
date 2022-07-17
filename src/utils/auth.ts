import jwt from "jsonwebtoken"

import { Request, Response } from "../utils"

namespace auth {
  export function authenticate_user(username: string, response: Response, delete_on_session_end?: boolean): Response {
    const user = { name: username }

    //encrypting the user name by secret key
    const access_token = jwt.sign(user, process.env.JWT_SECRET_KEY as string)

    if (delete_on_session_end) {
      return response.cookie("access_token", access_token)
    }
    return response.cookie("access_token", access_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
  }

  export function get_username(request: Request): string | undefined {
    if (!is_user_authenticated(request)) return undefined
    const access_token = request.cookies.access_token
    const jwt_payload = jwt.decode(access_token)
    const data = jwt_payload as jwt.JwtPayload
    return data?.name
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
}

export default auth
