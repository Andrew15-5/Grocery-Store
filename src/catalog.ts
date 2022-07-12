import { path, Request, Response } from "./utils"

namespace catalog {
  export function get(request: Request, response: Response) {
    response.sendFile(path.resolve("./public/catalog.html"))
  }
}

export default catalog
