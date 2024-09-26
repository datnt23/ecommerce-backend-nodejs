"use strict";

const { BadRequestError } = require("../core/error.response");
const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      throw new BadRequestError("Forbidden Error!");
    }

    //  check objKey
    const objKey = await findById(key);

    if (!objKey) {
      throw new BadRequestError("Forbidden Error!");
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new BadRequestError("Permission Denied!");
    }

    // console.log("Permission::", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new BadRequestError("Permission Denied!");
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
