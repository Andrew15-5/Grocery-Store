import cookie_parser from "cookie-parser"
import "dotenv/config"
import express from "express"

import account from "./account"
import catalog from "./catalog"
import home from "./home"
import login from "./login"
import registration from "./registration"
import utils from "./utils"
import { path } from "./utils"
import product from "./product"

process.on("SIGINT", utils.SIG_handler)
process.on("SIGTERM", utils.SIG_handler)

utils.make_sure_all_env_vars_are_set()

const app = express()
const SERVER_PORT = process.env.SERVER_PORT as string

app.set("view engine", "hbs")

app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser())
app.use(utils.update_theme_cookie)

app.get("/account", account.get)

app.get("/catalog", catalog.get)
app.post("/catalog", catalog.post)

app.get("/", home.get)
app.get("/home", home.get)

app.get("/login", login.get)
app.post("/login", login.post)

app.get("/product/:product_uri", product.get)
app.post("/product/:product_uri", product.post)

app.get("/registration", registration.get)
app.post("/registration", registration.post)

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
