import { Request } from "express"
import { Response } from "express-serve-static-core/index"

export function registrationLogic(request: Request, response: Response){

  //if the passwords don't match 
  if (request.body.password != request.body.repeat_password) {
    response.send("Passwords don't match")
  }

  response.send("Passwords match")
}