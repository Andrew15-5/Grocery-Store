import { path, pool, Request, Response } from "./utils"
namespace product {
    export async function get(request: Request, response: Response) {
        try {
            response.status(200).render("product.hbs")
        }
        catch (error) {
            console.log(error)
            response.status(500).redirect("/catalog")
        }
    }
}

export default product
