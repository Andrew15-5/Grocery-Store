import utils from "./utils"
import { Request, Response } from "./utils"

namespace home {
  export function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    response.status(200).render("home.hbs", { theme })
  }
}

export default home
