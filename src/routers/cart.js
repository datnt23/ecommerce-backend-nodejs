"use strict";

const express = require("express");
const cartController = require("../controllers/cart.controller");
const asyncHandler = require("../helpers/asyncHandler");
const { authenticationV2 } = require("../auth/authUtils");
const router = express.Router();

router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.deleteItemInCart));
router.post("/update", asyncHandler(cartController.updateItemToCart));
router.get("/", asyncHandler(cartController.getListUserCart));

//  authentication
router.use(authenticationV2);

module.exports = router;
