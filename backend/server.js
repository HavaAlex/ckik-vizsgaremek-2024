require('dotenv').config()


const dbContext = require("./api/db/dbContext")

const app = require("./app");

const cors = require('cors')

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

console.log("teszt2")
app.listen(3000);