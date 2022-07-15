import { fetch, Request, Response } from "./utils"
import * as auth from "./utils/auth"

async function get_reward_balance(username: string) {
  const REF_APP_SERVER_PORT = process.env.REF_APP_SERVER_PORT as string
  const get_referral_id_url =
    `http://localhost:${REF_APP_SERVER_PORT}/user-reward-balance/${username}`

  const data = await fetch(get_referral_id_url)
  if (data.status === 200) {
    return {
      reward_balance: (await data.json()).reward_balance as number
    }
  }
  else {
    return {
      reward_balance: '-',
      error_message:
        "Ошибка работы сервиса реферальных ссылок. " +
        `Не удалось получить Бонусный баланс.`
    }
  }
}

namespace account {
  export async function get(request: Request, response: Response) {
    try {
      const username = auth.get_username(request)
      if (!username) return response.status(401).redirect("/login")

      const { reward_balance, error_message } =
        await get_reward_balance(username)

      response.status(200).render("account.hbs", {
        error_message: error_message,
        reward_balance: reward_balance,
        username: username
      })
    }
    catch (error) {
      response.status(500).redirect("/catalog")
      throw error
    }
  }
}

export default account
