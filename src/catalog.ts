import { pool, Request, Response } from "./utils"
import * as auth from "./utils/auth"

namespace catalog {
  export async function get(request: Request, response: Response) {
    const { ref } = request.query

    try {
      const query_response =
        await pool.query("SELECT * FROM products ORDER BY name;")
      for (let i = 0; i < query_response.rowCount; i++) {
        const image_buffer = query_response.rows[i].image.toString("base64")
        const image_src = `data:image/png;base64,${image_buffer}`
        query_response.rows[i].image = image_src
      }
      const is_auth = auth.is_user_authenticated(request)
      response.status(200).render("catalog.hbs", {
        is_auth: is_auth,
        products: query_response.rows
      })
    }
    catch (error) {
      const suffix = (ref) ? "?ref=" + ref : ''
      response.status(500).redirect("/catalog" + suffix)
      throw error
    }
  }

  export async function post(request: Request, response: Response) {
    const { ref } = request.query
    const suffix = (ref) ? "?ref=" + ref : ''
    response.status(200).redirect("/catalog" + suffix)
  }
}

export default catalog
