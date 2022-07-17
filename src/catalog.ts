import * as utils from "./utils"
import { pool, QueryResult, Request, Response } from "./utils"
import * as auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

namespace catalog {
  export async function get(request: Request, response: Response) {
    try {
      const query = await pool.query("SELECT * FROM products ORDER BY name;")

      for (let i = 0; i < query.rowCount; i++) {
        const image_buffer: Buffer = query.rows[i].image
        const image_src =
          "data:image/png;base64," + image_buffer.toString("base64")
        query.rows[i].image = image_src
      }

      response.status(200).render("catalog.hbs", {
        is_auth: auth.is_user_authenticated(request),
        products: query.rows
      })
    }
    catch (error) {
      response.status(500).redirect(request.url)
      throw error
    }
  }

  export async function post(request: Request, response: Response) {
    const { product_uri } = request.body
    utils.purchase_product(request, response, product_uri)
  }
}

export default catalog
