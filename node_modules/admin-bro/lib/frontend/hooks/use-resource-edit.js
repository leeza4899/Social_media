"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _reactRouter = require("react-router");

var _apiClient = _interopRequireDefault(require("../utils/api-client"));

var _recordToFormData = _interopRequireDefault(require("../components/actions/record-to-form-data"));

var _appendForceRefresh = require("../components/actions/utils/append-force-refresh");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const api = new _apiClient.default();

const useResourceEdit = (initialRecord, resourceId, onNotice) => {
  var _initialRecord$params, _initialRecord$errors, _initialRecord$popula;

  const [record, setRecord] = (0, _react.useState)(_objectSpread(_objectSpread({}, initialRecord), {}, {
    params: (_initialRecord$params = initialRecord === null || initialRecord === void 0 ? void 0 : initialRecord.params) !== null && _initialRecord$params !== void 0 ? _initialRecord$params : {},
    errors: (_initialRecord$errors = initialRecord === null || initialRecord === void 0 ? void 0 : initialRecord.errors) !== null && _initialRecord$errors !== void 0 ? _initialRecord$errors : {},
    populated: (_initialRecord$popula = initialRecord === null || initialRecord === void 0 ? void 0 : initialRecord.populated) !== null && _initialRecord$popula !== void 0 ? _initialRecord$popula : {}
  }));
  const [loading, setLoading] = (0, _react.useState)(false);
  const history = (0, _reactRouter.useHistory)();

  const handleChange = (propertyOrRecord, value) => {
    if (typeof value === 'undefined' && !(typeof propertyOrRecord === 'string') && propertyOrRecord.params) {
      setRecord(propertyOrRecord);
    } else {
      setRecord(prev => _objectSpread(_objectSpread({}, prev), {}, {
        params: _objectSpread(_objectSpread({}, prev.params), {}, {
          [propertyOrRecord]: value
        })
      }));
    }
  };

  const handleSubmit = event => {
    const formData = (0, _recordToFormData.default)(record);
    setLoading(true);
    api.recordAction({
      resourceId,
      actionName: 'edit',
      recordId: record.id,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.notice) {
        onNotice(response.data.notice);
      }

      if (response.data.redirectUrl) {
        history.push((0, _appendForceRefresh.appendForceRefresh)(response.data.redirectUrl));
      } else {
        setRecord(prev => _objectSpread(_objectSpread({}, prev), {}, {
          errors: response.data.record.errors
        }));
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
      onNotice({
        message: 'There was an error updating record, Check out console to see more information.',
        type: 'error'
      });
    });
    event.preventDefault();
    return false;
  };

  return {
    record,
    handleChange,
    handleSubmit,
    loading
  };
};

var _default = useResourceEdit;
exports.default = _default;