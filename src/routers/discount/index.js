"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//  get amount a discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

//  authentication
router.use(authenticationV2);

router.post("/", asyncHandler(discountController.createDiscountCode));
router.get("/", asyncHandler(discountController.getAllDiscountCode));

module.exports = router;
