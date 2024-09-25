"use strict";

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  login = async (req, res, next) => {
    console.log(`[P]::login::`, req.body);
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    new CREATED({
      message: "Registered Ok!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
