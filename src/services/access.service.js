"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const ROLES = {
  shop: "SHOP",
  writer: "WRITER",
  editor: "EDITOR",
  admin: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //  Step 1: check email exists?
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [ROLES.shop],
      });

      if (newShop) {
        //  created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", // pkcs8 //  Public-Key Cryptography Standards 1 (PKCS1)
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1", //  Public-Key Cryptography Standards 1 (PKCS1)
            format: "pem",
          },
        });

        console.log({ privateKey, publicKey }); //  save collection keyStore

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "Public Key String error!",
          };
        }

        console.log(`Public Key String::`, publicKeyString);
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(`Public Key Object::`, publicKeyObject);

        //  create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );

        console.log(`Created Token Success::`, tokens);

        return {
          code: 201,
          metadata: {
            // shop: {
            //   id: newShop._id,
            //   name: newShop.name,
            //   email: newShop.email,
            // },

            //  use Lodash
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
