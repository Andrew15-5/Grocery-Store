import utils from "./utils"
import { Request, Response } from "./utils"
import auth from "./utils/auth"
import fetch_data from "./utils/fetch_data"

namespace account {
  export async function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)

    try {
      const username = auth.get_username(request)
      if (!username) {
        return response.status(401).redirect(
          `/login?referrer=${encodeURIComponent(request.originalUrl)}`)
      }

      const { referral_id, reward_balance, error_message } =
        await fetch_data.reward_balance_and_referral_id(username)

      let js_onclick_script
      let referral_url
      if (!error_message) {
        const host = request.get("host")
        referral_url = `${host}/catalog?ref=${referral_id}`
        js_onclick_script =
          `navigator.clipboard.writeText("${referral_url}");`
      }
      else response.cookie("error_message", error_message)

      response.status(200).render("account.hbs", {
        error_message: error_message,
        js_onclick_script: js_onclick_script,
        referral_url: referral_url,
        reward_balance: reward_balance,
        username: username,
        theme
      })
    }
    catch (error) {
      response.status(500).redirect("/catalog")
      throw error
    }
  }
}

export default account
