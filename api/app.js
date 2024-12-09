const express = require("express");

const app = express();

const toyRoutes = require("./api/routes/toyRoutes");

const errorHandler = require("./api/middlewares/errorHandler");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/toys", toyRoutes);

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);

module.exports = app;