import { fetch, pool, QueryResult, Request, Response } from "./utils"
import * as auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

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

  async function process_referral_purchase(purchase_uuid: string, referral_id: string) {
    const REF_APP_SERVER_PORT = process.env.REF_APP_SERVER_PORT as string
    const get_referral_id_url =
      `http://localhost:${REF_APP_SERVER_PORT}/process-purchase`

    const parameters = new URLSearchParams()
    parameters.append("purchase_uuid", purchase_uuid)
    parameters.append("referral_id", referral_id)
    await fetch(get_referral_id_url, {
      method: "POST",
      body: parameters
    })
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

      if (ref) await process_referral_purchase(purchase_uuid, ref as string)

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
