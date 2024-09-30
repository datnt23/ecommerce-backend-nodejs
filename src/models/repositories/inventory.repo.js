"use strict";

const { Types } = require("mongoose");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModel.create({
    inven_productId: new Types.ObjectId(productId),
    inven_stock: stock,
    inven_location: location,
    inven_shopId: new Types.ObjectId(shopId),
  });
};

module.exports = {
  insertInventory,
};
