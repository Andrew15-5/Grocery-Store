import express from "express"
import { path } from "./utils"
import * as utils from "./utils"

const app = express()
const SERVER_PORT = 3000

utils.make_sure_all_env_vars_are_set()

app.use(express.static(path.resolve("./public")))

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
