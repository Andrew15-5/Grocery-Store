import * as utils from "./utils"
import { pool, QueryResult, Request, Response } from "./utils"
import * as auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

namespace catalog {
  export async function get(request: Request, response: Response) {
    const { ref } = request.query
    const suffix = (ref) ? "?ref=" + ref : ''
    const redirect_url = "/catalog" + suffix

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
      response.status(500).redirect(redirect_url)
      throw error
    }
  }

  export async function post(request: Request, response: Response) {
    const { product_uri } = request.body
    const { ref } = request.query
    const suffix = (ref) ? "?ref=" + ref : ''
    const redirect_url = "/catalog" + suffix

    const username = auth.get_username(request)
    if (!username) return response.status(401).redirect("/login")
    if (!product_uri) return response.status(400).redirect(redirect_url)

    let query: QueryResult<any>

    try {
      query = await fetch_data.user("username", username, "uuid")
      const user_uuid = query.rows[0].uuid

      query = await fetch_data.product("uri", product_uri, "uuid, name")
      if (query.rowCount === 0) {
        response.status(400).redirect(redirect_url)
      }
      const product_uuid = query.rows[0].uuid
      const product_name = query.rows[0].name

      query = await pool.query(
        "INSERT INTO purchases (user_uuid, product_uuid) \
        VALUES ($1, $2) RETURNING uuid",
        [user_uuid, product_uuid])
      const purchase_uuid = query.rows[0].uuid

      if (ref) {
        await utils.process_referral_purchase(purchase_uuid, ref as string)
      }

      response.cookie("alert_message", `Вы приобрели ${product_name}`)
    }
    catch (error) {
      response.status(500).redirect(redirect_url)
      throw error
    }

    response.status(200).redirect(redirect_url)
  }
}

export default catalog
