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

/*  em nghĩ là hàm updateNestedObjectParser nên tối ưu một chút vì lỡ đâu có 3 4 populate nested nhau dẫn đến forEach phải 3 4 lần theo 
    em sữa lại thành như này 
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
};*/
// =>
const updateNestedObjectParser = (obj, prefix = "") => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] === null || obj[key] === undefined) {
      console.log(`ingore key`, key);
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      Object.assign(result, updateNestedObjectParser(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
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
