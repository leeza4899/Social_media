"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.filterStyles = void 0;

var _focusShadow = _interopRequireDefault(require("../components/design-system/utils/focus-shadow.style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const selectStyles = theme => ({
  control: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
    borderRadius: '0px',
    borderWidth: '1px',
    background: theme.colors.white,
    color: theme.colors.grey80,
    '&:hover': {
      borderColor: theme.colors.grey60
    },
    borderColor: state.isFocused ? theme.colors.primary100 : theme.colors.inputBorder,
    boxShadow: state.isFocused ? (0, _focusShadow.default)(theme) : 'none'
  }),
  menu: provided => _objectSpread(_objectSpread({}, provided), {}, {
    borderRadius: '0px',
    borderColor: theme.colors.grey20,
    background: theme.colors.white
  }),
  input: () => ({
    color: theme.colors.grey80,
    background: theme.colors.white,
    border: 'none'
  }),
  singleValue: () => ({
    color: theme.colors.grey80
  }),
  option: (provided, state) => {
    let color = state.isSelected ? theme.colors.grey80 : theme.colors.grey60;

    if (state.isFocused) {
      color = theme.colors.white;
    }

    return _objectSpread(_objectSpread({}, provided), {}, {
      color,
      background: state.isFocused ? theme.colors.primary100 : 'transparent'
    });
  }
});

const filterStyles = theme => ({
  control: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
    border: state.isFocused ? `1px solid ${theme.colors.primary100}` : `1px solid ${theme.colors.filterInputBorder}`,
    borderRadius: '0px',
    background: 'transparent',
    color: theme.colors.white,
    boxShadow: state.isFocused ? (0, _focusShadow.default)(theme) : 'none'
  }),
  input: () => ({
    color: theme.colors.white
  }),
  singleValue: () => ({
    color: theme.colors.white
  }),
  option: (provided, state) => _objectSpread(_objectSpread({}, provided), {}, {
    color: state.isSelected ? theme.colors.white : theme.colors.grey20,
    background: state.isFocused ? 'rgba(32,39,62,0.25)' : 'transparent'
  }),
  menu: provided => _objectSpread(_objectSpread({}, provided), {}, {
    borderRadius: '0px',
    borderColor: theme.colors.grey20,
    background: theme.colors.filterBg,
    zIndex: 5
  })
});

exports.filterStyles = filterStyles;
var _default = selectStyles;
exports.default = _default;