"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //  check cartId exists?
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exists!");
    const checkoutOrder = {
        totalPrice: 0, //    Tổng tiền hàng
        feeShip: 0, //  Phí vận chuyển
        totalDiscount: 0, //  Tổng tiền giảm giá
        totalCheckout: 0, //   Tổng thanh toán
      },
      shop_order_ids_new = [];
    //  Tính tổng tiền bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      //  check product available
      const checkProductServer = await checkProductByServer(item_products);
      console.log("checkProductServer::", checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("Order Wrong!");
      // Tổng tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      // Tổng tiền trước khi xử lý
      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, //   Tiền trước khi giảm giá
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };
      //    Nếu shop_discounts tồn tại > 0, check xem có hợp lệ hay không?
      if (shop_discounts.length > 0) {
        //  get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        //  total discount
        checkoutOrder.totalDiscount += discount;
        // if totalDiscount > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      //    last total
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }
}

module.exports = CheckoutService;
