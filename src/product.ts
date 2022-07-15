import { path, pool, Request, Response } from "./utils"
namespace product {
    export async function get(request: Request, response: Response) {
        try {
            const uri = request.params["product_uri"]
            const query_response = await pool.query(
                `SELECT * from products where uri = '${uri}';`)
            for (let i = 0; i < query_response.rowCount; i++) {
                const image_buffer = query_response.rows[i].image.toString("base64")
                const image_src = `data:image/png;base64,${image_buffer}`
                query_response.rows[i].image = image_src
            }
            response.status(200).render("product.hbs", {
                products: query_response.rows
            })
        }
        catch (error) {
            console.log(error)
            response.status(500).redirect("/catalog")
        }
    }
}

export default product
