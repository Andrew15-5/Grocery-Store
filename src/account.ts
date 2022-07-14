import { pool, Request, Response } from "./utils"
import { get_username } from "./utils/auth"


namespace account {
    export async function get(request: Request, response: Response) {
        try {
            const username = get_username(request)
            const query_response = await pool.query(
                `SELECT * FROM users WHERE username = '${username}';`)
            response.status(200).render("account.hbs", {
                account: query_response.rows
            })
        }
        catch (error) {
            response.status(500).redirect("/registration")
            throw error
        }
    }

    export async function post(request: Request, response: Response) {
    }
}

export default account
