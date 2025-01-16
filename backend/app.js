const express = require("express");

const app = express();

const paholyRoutes = require("./api/routes/paholyRoutes");

const adminRoutes = require("./api/routes/adminRoutes")

const loginRoutes = require("./api/routes/loginRoutes")

const errorHandler = require("./api/middlewares/errorHandler");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/login",loginRoutes)

app.use("/paholy", paholyRoutes);

app.use("/admin", adminRoutes);

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);

module.exports = app;