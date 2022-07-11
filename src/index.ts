import express from "express"
import path from "path"
import * as utils from "./utils"
import { registration_logic } from "./registration"

const app = express()
const SERVER_PORT = 3000

utils.make_sure_all_env_vars_are_set()

app.use(express.static(path.resolve("./public")))

app.get("/catalog", function (request, response) {
  response.sendFile(path.resolve("./public/catalog.html"));
});

app.get("/registration", function (request, response) {
  response.sendFile(path.resolve("./public/registration.html"));
});

// creating a parser for the data application/x-www-form-urlencoded
const urlencoded_parser = express.urlencoded({ extended: false });

//getting password from form
app.post("/registration", urlencoded_parser, registration_logic)

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
