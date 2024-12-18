"use strict";

const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");

/*
    Key features: Cart service
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increase product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]
*/
class CartService {
  //  start repo cart
  static async createUserCar({ userId, product }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }
  //  end repo cart
  static async addToCart({ userId, product = {} }) {
    //  check cart is exists?
    const userCart = await cartModel.findOne({
      cart_userId: userId,
    });
    if (!userCart) {
      //  create cart for user
      return await CartService.createUserCar({ userId, product });
    }

    //  if cart is exists but have not product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    //  cart is exists and have product => update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }
  //    update cart
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //  check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not exists!");
    //  compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop!");
    }
    if (quantity === 0) {
      //  delete
      return await CartService.deleteUserCart({ userId, productId });
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }
  static async deleteItemUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    return await cartModel.updateOne(query, updateSet);
  }

  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
