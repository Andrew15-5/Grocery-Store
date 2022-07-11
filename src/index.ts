import express from "express"
import path from "path"
import { registrationLogic } from "./registration"

const app = express()
const SERVER_PORT = 3000

app.use(express.static(path.resolve("./public")))

app.get("/registration", function (request, response) {
  response.sendFile(path.resolve("./public/registration.html"));
});

// creating a parser for the data application/x-www-form-urlencoded
const urlencoded_parser = express.urlencoded({ extended: false });

//getting password from form
app.post("/registration", urlencoded_parser, registrationLogic)

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
