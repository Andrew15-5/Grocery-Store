import { Request } from "express"
import { Response } from "express-serve-static-core/index"
import { authenticate_user } from "./utils/auth"
import { generate_hash } from "./utils/hash"
import { pool } from "./utils"

export function registration_logic(request: Request, response: Response){
  if (request.body.password != request.body.repeat_password) {
    return response.send("Passwords don't match")
  }
  
  const hash = generate_hash(request.body.password)

  authenticate_user(request.body.username, response)

  pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2);", 
    [request.body.username, hash])
    .then(() => { response.redirect("/catalog") })
    .catch(error => { throw error })
}