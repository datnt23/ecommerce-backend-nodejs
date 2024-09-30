"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongoDb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

//  ['a','b']=>{a:1, b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
//  ['a','b']=>{a:0, b:0}
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj, result = {}) => {
  Object.keys(obj || {}).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response || {}).forEach((a) => {
        result[`${key}.${a}`] = response[a];
      });
    } else {
      result[key] = obj[key];
    }
  });
  return result;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDb,
};
