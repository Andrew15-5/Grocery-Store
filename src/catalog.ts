import { pool, Request, Response } from "./utils"
import * as auth from "./utils/auth"

namespace catalog {
  export async function get(request: Request, response: Response) {
    try {
      const query_response = await pool.query(
        "SELECT image, name, price, description FROM products ORDER BY name;")
      for (let i = 0; i < query_response.rowCount; i++) {
        const image_buffer = query_response.rows[i].image.toString("base64")
        const image_src = `data:image/png;base64,${image_buffer}`
        query_response.rows[i].image = image_src
      }
      const is_auth = auth.is_user_authenticated(request)
      response.status(200).render("catalog.hbs", {
        products: query_response.rows, is_auth: is_auth
      })
    }
    catch (error) {
      response.status(500).redirect("/")
      throw error
    }
  }
}

export default catalog
