"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//  login
router.post("/shop/login", asyncHandler(accessController.login));
//  signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));

//  authentication
router.use(authenticationV2);
//  logout
router.post("/shop/logout", asyncHandler(accessController.logout));
//  handlerRefreshToken
router.post(
  "/shop/handlerRefreshToken",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
