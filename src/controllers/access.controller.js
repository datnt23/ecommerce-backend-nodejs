"use strict";

const AccessService = require("../services/access.service");
// const { CreatedResponse } = require("../core/success.response");
class AccessController {
  signUp = async (req, res, next) => {
    // new CreatedResponse({
    //   message: "Registered Ok!",
    //   metadata: await AccessService.signUp(req.body),
    // }).send(res);
    try {
      console.log(`[P]::signUp::`, req.body);
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
