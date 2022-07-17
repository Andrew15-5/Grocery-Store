import { Request, Response } from "./utils"

namespace home {
  export function get(request: Request, response: Response) {
    const theme = request.cookies.theme
    response.status(200).render("home.hbs", { theme: theme })
  }
}

export default home
