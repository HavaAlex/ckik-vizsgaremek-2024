require('dotenv').config()

const dbContext = require("./api/db/dbContext")

const app = require("./app");

app.listen(3000);