const express = require("express");

const app = express();

const cors = require('cors')

const corsOptions ={
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');

const options = 
{ 
  definition: 
  {
    openapi: '3.0.0',
    info: {
      title: 'Páholy API',
      version: '1.0.0',
    },
  },
  apis: ["./api/routes/*.js", "./api/models/index.js"],
};

const swaggerDocument = require('./swagger_output.json')
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const openapiSpecification = swaggerJsdoc(options);

app.use(cors(corsOptions));


const adminRoutes = require("./api/routes/adminRoutes")

const loginRoutes = require("./api/routes/loginRoutes")

const orarendRoutes = require("./api/routes/orarendRoutes");

const tanarRoutes = require("./api/routes/tanarRoutes")

const csoportRoutes = require("./api/routes/csoportRoutes")

const uzenetRoutes = require("./api/routes/uzenetRoutes")

const hianyzasRoutes = require("./api/routes/hianyzasRoutes")

const feladatRoutes = require("./api/routes/feladatRoutes")

const jegyRoutes = require("./api/routes/jegyRoutes")

const szuloRoutes = require("./api/routes/szuloRoutes")

const errorHandler = require("./api/middlewares/errorHandler");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/login",loginRoutes)

app.use("/uzenet", uzenetRoutes);

app.use("/orarend", orarendRoutes);

app.use("/hianyzas", hianyzasRoutes);

app.use("/feladat", feladatRoutes);

app.use("/jegy", jegyRoutes);

app.use("/admin", adminRoutes);

app.use("/csoport", csoportRoutes);

app.use("/szulo", szuloRoutes);

app.use("/tanar",tanarRoutes)

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);

module.exports = app;