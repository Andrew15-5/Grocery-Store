import utils from "./utils"
import { Request, Response } from "./utils"
import auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

namespace product {
  export async function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)
    const host = request.get("host")

    try {
      const username = auth.get_username(request)
      let referral_id
      if (username) ({ referral_id } = await fetch_data.referral_id(username))

      const { product_uri } = request.params
      const query = await fetch_data.product("uri", product_uri, "*")

      const product = query.rows[0]
      const image_buffer: Buffer = product.image
      const image_src =
        "data:image/png;base64," + image_buffer.toString("base64")
      product.image = image_src
      if (username) {
        const referral_url =
          `${host}/product/${product.uri}?ref=${referral_id}`
        product.js_onclick_script =
          `navigator.clipboard.writeText("${referral_url}");`
      }

      response.status(200).render("product.hbs", {
        is_auth: auth.is_user_authenticated(request),
        product: product,
        theme: theme
      })
    }
    catch (error) {
      response.status(500).redirect("/catalog")
      throw error
    }
  }

  export async function post(request: Request, response: Response) {
    const { product_uri } = request.params
    utils.purchase_product(request, response, product_uri)
  }
}

export default product
