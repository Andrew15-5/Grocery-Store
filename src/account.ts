import { Request, Response } from "./utils"

namespace account {
    export async function get(request: Request, response: Response) {
        response.status(200).render("account.hbs")
    }

    export async function post(request: Request, response: Response) {
    }
}

export default account
