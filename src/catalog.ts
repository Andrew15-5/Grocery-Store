import { path, Request, Response } from "./utils"

namespace catalog {
  export function get(request: Request, response: Response) {
    response.status(200).render("catalog.hbs")
  }
}

export default catalog
