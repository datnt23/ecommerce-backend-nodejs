"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

//  check apiKey
router.use(apiKey);

//  check permission
router.use(permission("0"));

router.use("/product", require("./product"));
router.use("/", require("./access"));

module.exports = router;
