import express from "express"

const app = express()
const SERVER_PORT = 3000

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`)
})
