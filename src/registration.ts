import { Request } from "express"
import { Response } from "express-serve-static-core/index"

export function registration_logic(request: Request, response: Response){

  if (request.body.password != request.body.repeat_password) {
    return response.send("Passwords don't match")
  }

  response.redirect("/catalog")
}