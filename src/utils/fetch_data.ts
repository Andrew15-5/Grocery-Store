import { pool } from "../utils"

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
}

export default fetch_data
