import express from "express"
import path from "path"

const app = express()
const SERVER_PORT = 3000

app.use(express.static(path.resolve("./public")))

app.get("/registration", function (request, response) {
  response.sendFile(path.resolve("./public/registration.html"));
});

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
