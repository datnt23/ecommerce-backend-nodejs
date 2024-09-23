const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//  init middlewares
// app.use(morgan("combined")); //  use for production
app.use(morgan("dev")); //  use for development
app.use(helmet());
app.use(compression());

//  init database

//  init routers

//  handling error
app.get("/", (req, res, next) => {
  const strCompress = "asdfasdfasdf";
  return res.status(200).json({
    message: "Hello World!",
    metadata: strCompress.repeat(100000),
  });
});

module.exports = app;
