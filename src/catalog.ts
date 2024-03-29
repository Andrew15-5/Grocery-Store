import utils from "./utils"
import { pool, Request, Response } from "./utils"
import auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

namespace catalog {
  export async function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    const host = request.get("host")

    try {
      let username = auth.get_username(request)
      let referral_id, error_message
      if (username && !await auth.is_user_exist(request)) {
        auth.deauthenticate_user(response)
        username = undefined
      }
      if (username) {
        ({ referral_id, error_message } =
          await fetch_data.referral_id(username))
      }

      const query = await pool.query("SELECT * FROM products ORDER BY name;")

      for (let i = 0; i < query.rowCount; i++) {
        const image_buffer: Buffer = query.rows[i].image
        const image_src =
          "data:image/png;base64," + image_buffer.toString("base64")
        query.rows[i].image = image_src
        query.rows[i].js_cursor_wait_script =
          "for (const tag of ['input', 'a', 'body'])" +
          "for (const e of document.getElementsByTagName(tag))" +
          "{e.setAttribute('class', e.getAttribute('class') + ' wait');}"
        if (username && !error_message) {
          const referral_url =
            `${host}/product/${query.rows[i].uri}?ref=${referral_id}`
          query.rows[i].js_clipboard_script =
            `navigator.clipboard.writeText("${referral_url}");`
        }
      }

      if (username && error_message) {
        response.cookie("error_message", error_message)
      }

      response.status(200).render("catalog.hbs", {
        error_message: error_message,
        is_auth: username,
        products: query.rows,
        theme: theme
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
