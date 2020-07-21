"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _flat = _interopRequireDefault(require("flat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Returns a function which takes a record and returns an updated record.
 *
 * @param {string}      property    property that must be updated, supports nesting
 *                                  with dots
 * @param {any}         value       value that must be set, undefined or null if
 *                                  deleting, will be flattened
 * @param {RecordJSON}  refRecord   if value is reference ID, this must be a record
 *                                  it's referencing to
 * @private
 */
const updateRecord = (property, value, refRecord) => previousRecord => {
  let populatedModified = false;

  const populatedCopy = _objectSpread({}, previousRecord.populated);

  const paramsCopy = _objectSpread({}, previousRecord.params); // clear previous value


  Object.keys(paramsCopy).filter(key => key === property || key.startsWith(`${property}.`)).forEach(k => delete paramsCopy[k]);

  if (property in populatedCopy) {
    delete populatedCopy[property];
    populatedModified = true;
  } // set new value


  if (typeof value !== 'undefined') {
    if (typeof value === 'object' && !(value instanceof File) && value !== null) {
      const flattened = _flat.default.flatten(value);

      Object.keys(flattened).forEach(key => {
        paramsCopy[`${property}.${key}`] = flattened[key];
      });
    } else {
      paramsCopy[property] = value;
    }

    if (refRecord) {
      populatedCopy[property] = refRecord;
      populatedModified = true;
    }
  }

  return _objectSpread(_objectSpread({}, previousRecord), {}, {
    params: paramsCopy,
    populated: populatedModified ? populatedCopy : previousRecord.populated
  });
};

var _default = updateRecord;
exports.default = _default;