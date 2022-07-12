import { Request } from "express"
import { Response } from "express-serve-static-core/index"
import { authenticate_user } from "./utils/auth"
import { generate_hash } from "./utils/hash"
import { path, pool } from "./utils"

namespace registration {
  export function get(request: Request, response: Response) {
    response.sendFile(path.resolve("./public/registration.html"))
  }

  export async function post(request: Request, response: Response) {
    if (request.body.password != request.body.repeat_password) {
      return response.send("Passwords don't match")
    }

    const hash = await generate_hash(request.body.password)

    authenticate_user(request.body.username, response)

    pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2);",
      [request.body.username, hash])
      .then(() => { response.redirect("/catalog") })
      .catch(error => { throw error })
  }
}

export default registration
