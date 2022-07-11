import { Request } from "express"
import { Response } from "express-serve-static-core/index"
import { path } from "./utils"
import * as auth from "./utils/auth"

namespace login {
  export function get(reqest: Request, response: Response) {
    response.status(200)
    if (auth.is_user_authenticated(reqest)) {
      response.redirect("/catalog")
    }
    response.sendFile(path.resolve("./public/login.html"))
  }
}

export default login
