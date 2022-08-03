import utils from "./utils"
import { fetch, Request, Response } from "./utils"
import auth from "./utils/auth"

async function get_reward_balance_and_referral_id(username: string) {
  const REF_APP_SERVER_PORT = process.env.REF_APP_SERVER_PORT as string
  const get_referral_info_url =
    `http://localhost:${REF_APP_SERVER_PORT}/user-referral-info/${username}`
  const data = await fetch(get_referral_info_url)

  if (data.status === 200) {
    return await data.json()
  }
  return {
    reward_balance: '-',
    error_message:
      "Ошибка работы сервиса реферальных ссылок. " +
      `Не удалось получить Бонусный баланс.`
  }
}

namespace account {
  export async function get(request: Request, response: Response) {
    const theme = utils.get_current_theme(request)

    try {
      const username = auth.get_username(request)
      if (!username) return response.status(401).redirect("/login")

      const { referral_id, reward_balance, error_message } =
        await get_reward_balance_and_referral_id(username)

      const host = request.get("host")
      const referral_url = `${host}/catalog?ref=${referral_id}`
      const js_onclick_script =
        `navigator.clipboard.writeText("${referral_url}");`

      response.status(200).render("account.hbs", {
        error_message: error_message,
        js_onclick_script: js_onclick_script,
        referral_id: referral_id,
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
