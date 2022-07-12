import { path, Request, Response } from "./utils"

namespace catalog {
  export function get(request: Request, response: Response) {
    response.status(200).sendFile(path.resolve("./public/catalog.html"))
  }
}

export default catalog
