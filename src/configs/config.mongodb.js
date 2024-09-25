"use strict";

//  level 0
// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "ecommerce-backend",
//   },
// };

//  level 1
const development = {
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "ecommerce-backend-dev",
  },
};

const production = {
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "ecommerce-backend-pro ",
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || "development";
module.exports = config[env];
