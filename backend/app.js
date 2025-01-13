const express = require("express");

const app = express();

<<<<<<< HEAD
const paholyRoutes = require("./api/routes/paholyRoutes");

const adminRoutes = require("./api/routes/adminRoutes")

const errorHandler = require("./api/middlewares/errorHandler");

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use("/paholy", paholyRoutes);

app.use("/admin", adminRoutes);

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);
=======
// const paholyRoutes = require("./api/routes/paholyRoutes");

// const adminRoutes = require("./api/routes/adminRoutes")

// const errorHandler = require("./api/middlewares/errorHandler");

// app.use(express.json());

// app.use(express.urlencoded({extended: true}));

// app.use("/paholy", paholyRoutes);

// app.use("/admin", adminRoutes);

// app.use(errorHandler.notFoundError);

// app.use(errorHandler.showError);
>>>>>>> 06c947dadab9077a2caf580ad205e8493aff9b31

module.exports = app;