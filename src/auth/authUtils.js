"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    /*
    Notes: JWT.sign cái nào thì phải dùng cái đó để JWT.verify
    =>Đúng nhưng là trong trường hợp không sử dụng algorithm: 'RS256'=>
    =>Còn với thuật toán RS256 thì phải luôn có 1 cặp key khác nhau, một key dùng để mã hóa và một key dùng để giải mã.
    */
    //  accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    //

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`Error verify::`, err);
      } else {
        console.log(`Decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
