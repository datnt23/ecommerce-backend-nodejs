"use strict";

//  key !mdbg install by Mongo Snippets for Node.js

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts ";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", //  percentage
    },
    discount_value: {
      type: Number,
      required: true,
    }, //   10.000, 10
    discount_code: {
      type: String,
      required: true,
    }, //   discount code
    discount_start_date: {
      type: Date,
      required: true,
    }, //   ngày bắt đàu
    discount_end_date: {
      type: Date,
      required: true,
    }, //    ngày kết thúc
    discount_max_uses: {
      type: Number,
      required: true,
    }, //  số lượng discount được áp dụng
    discount_uses_count: {
      type: Number,
      required: true,
    }, //  số discount đã sử dụng
    discount_users_used: {
      type: Array,
      default: [],
    }, //  người sử dụng
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    }, // số lượng cho phép tối đa được sử dụng mỗi user
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    }, //  số sản phẩm đã áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
