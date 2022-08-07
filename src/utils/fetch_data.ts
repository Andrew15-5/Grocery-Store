import { fetch, pool } from "../utils"

namespace fetch_data {
  async function fetch_data(table: string, search_key: string, search_value: string, return_key: string) {
    const query_response = await pool.query(
      `SELECT ${return_key} FROM ${table} \
       WHERE ${search_key} = $1;`, [search_value])
    return query_response
  }

  export async function user(search_key: string, search_value: string, return_key: string) {
    return fetch_data("users", search_key, search_value, return_key)
  }

  export async function product(search_key: string, search_value: string, return_key: string) {
    return fetch_data("products", search_key, search_value, return_key)
  }

  export async function referral_id(username: string) {
    const REF_APP_SERVER_PORT = process.env.REF_APP_SERVER_PORT as string
    const get_referral_id_url =
      `http://localhost:${REF_APP_SERVER_PORT}/user-referral-id/${username}`
    try {
      const data = await fetch(get_referral_id_url)
      if (data.status === 200) return await data.json()
    }
    catch (e) { }
    return { error_message: "Ошибка работы сервиса реферальных ссылок. " }
  }
}

export default fetch_data
