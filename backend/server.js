require('dotenv').config()

const dbContext = require("./api/db/dbContext")

const app = require("./app");

console.log("Server is running on port: ", process.env.PORT);

app.listen(process.env.PORT);