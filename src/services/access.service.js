"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const ROLES = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    1 - check email in db
    2 - match password
    3 - create accessToken vs refreshToken and save
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    //  1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");
    //  2
    const matchPassword = bcrypt.compare(password, foundShop.password);
    if (!matchPassword) throw new AuthFailureError("Authentication error!");
    //  3
    //  created privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //  4
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      //  use Lodash
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ROLES.SHOP],
    });
    if (newShop) {
      //  created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // console.log({ privateKey, publicKey }); //  save collection keyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: Keys error!");
      }
      //  create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        //  use Lodash
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
