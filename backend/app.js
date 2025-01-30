const express = require("express");

const app = express();

const cors = require('cors')

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const paholyRoutes = require("./api/routes/paholyRoutes");

const adminRoutes = require("./api/routes/adminRoutes")

const loginRoutes = require("./api/routes/loginRoutes")

const orarendRoutes = require("./api/routes/orarendRoutes");

const errorHandler = require("./api/middlewares/errorHandler");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/login",loginRoutes)

app.use("/paholy", paholyRoutes);

app.use("/admin", adminRoutes);

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);

module.exports = app;