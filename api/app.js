const express = require("express");

const app = express();

const paholyRoutes = require("./api/routes/paholyRoutes");

const errorHandler = require("./api/middlewares/errorHandler");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/paholy", paholyRoutes);

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);

module.exports = app;