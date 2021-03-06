'use strict';

const parseAttribute = require('./parseAttribute');

const {
  isString,
  isObject,
  isNode,
  likeArray,
  isNumber,
  isBool
} = require('../util');

const parseArgs = (args, {
  doParseStyle = true
} = {}) => {
  let tagName,
    attributes = {},
    childExp = [];

  let first = args.shift();

  let parts = splitTagNameAttribute(first);

  if (parts.length > 1) { // not only tagName
    tagName = parts[0];
    attributes = parts[1];
  } else {
    tagName = first;
  }

  let next = args.shift();

  let nextAttr = {};

  if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
    childExp = next;
  } else if (isObject(next)) {
    nextAttr = next;
    childExp = args.shift() || [];
  }

  attributes = parseAttribute(attributes, nextAttr, {
    doParseStyle
  });

  let childs = parseChildExp(childExp);

  return {
    tagName,
    attributes,
    childs
  };
};

let splitTagNameAttribute = (str = '') => {
  if (typeof str !== 'string') return [str];

  let tagName = str.split(' ')[0];
  let attr = str.substring(tagName.length);
  attr = attr && attr.trim();

  tagName = tagName.toLowerCase().trim();
  if (attr) {
    return [tagName, attr];
  } else {
    return [tagName];
  }
};

const parseChildExp = (childExp) => {
  let ret = [];
  if (isNode(childExp)) {
    ret.push(childExp);
  } else if (likeArray(childExp)) {
    for (let i = 0; i < childExp.length; i++) {
      let child = childExp[i];
      ret = ret.concat(parseChildExp(child));
    }
  } else if (childExp) {
    ret.push(childExp);
  }
  return ret;
};

module.exports = parseArgs;
