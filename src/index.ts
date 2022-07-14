import cookie_parser from "cookie-parser"
import express from "express"

import catalog from "./catalog"
import login from "./login"
import registration from "./registration"
import { path } from "./utils"
import * as utils from "./utils"

utils.make_sure_all_env_vars_are_set()

const app = express()
const SERVER_PORT = process.env.SERVER_PORT as string

app.set("view engine", "hbs")

app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser())

app.get("/catalog", catalog.get)
app.post("/catalog", catalog.post)

app.get("/login", login.get)
app.post("/login", login.post)

app.get("/registration", registration.get)
app.post("/registration", registration.post)

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
