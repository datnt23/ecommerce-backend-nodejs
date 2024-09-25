"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;

// console.log("Connect String: ", connectString);
mongoose
  .connect(connectString)
  .then((_) => console.log("Connected MongoDB success Lv0!"))
  .catch((err) => console.log("Error connect!"));

//    dev
if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
