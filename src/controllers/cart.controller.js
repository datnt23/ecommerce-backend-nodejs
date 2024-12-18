"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
class CartController {
  /**
   * @des add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /api/v1/cart/userId
   * @return{
   * }
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Cart success!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };
  updateItemToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Cart success!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  deleteItemInCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Cart success!",
      metadata: await CartService.deleteItemUserCart(req.body),
    }).send(res);
  };
  getListUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Cart success!",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
