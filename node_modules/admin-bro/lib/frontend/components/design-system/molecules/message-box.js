"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MessageBox = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledSystem = require("styled-system");

var _box = require("../atoms/box");

var _icon = require("../atoms/icon");

var _button = require("../atoms/button");

var _cssClass = require("../utils/css-class");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const sizeVariants = (0, _styledSystem.variant)({
  prop: 'size',
  variants: {
    sm: {
      boxShadow: 'none',
      '& > section, & + section': {
        px: 'lg',
        py: 'default'
      },
      [`& > ${_button.Button}`]: {
        margin: '0px'
      }
    }
  }
});

const variants = theme => (0, _styledSystem.variant)({
  variants: {
    success: {},
    danger: {
      bg: 'errorLight',
      'box-shadow': `0 2px 0 0 ${theme.colors.error};`,
      '& + section': {
        borderColor: 'errorLight'
      }
    },
    info: {
      bg: 'primary20',
      'box-shadow': `0 2px 0 0 ${theme.colors.primary100};`,
      '& + section': {
        borderColor: 'primary20'
      }
    }
  }
});

const StyledMessageBox = _styledComponents.default.div.withConfig({
  displayName: "message-box__StyledMessageBox",
  componentId: "sc-1wpq7j8-0"
})(["line-height:", ";box-shadow:0 2px 0 0 ", ";background:", ";color:", ";& > ", "{float:right;margin:8px;& svg{fill:", ";}}", ";", ";"], ({
  theme
}) => theme.lineHeights.default, ({
  theme
}) => theme.colors.success, ({
  theme
}) => theme.colors.successLight, ({
  theme
}) => theme.colors.grey80, _button.Button, ({
  theme
}) => theme.colors.grey80, ({
  theme
}) => variants(theme), sizeVariants);

const StyledCaption = (0, _styledComponents.default)(_box.Box).withConfig({
  displayName: "message-box__StyledCaption",
  componentId: "sc-1wpq7j8-1"
})([""]);
StyledCaption.defaultProps = {
  px: 'xl',
  py: 'lg'
};
const StyledChildren = (0, _styledComponents.default)(_box.Box).withConfig({
  displayName: "message-box__StyledChildren",
  componentId: "sc-1wpq7j8-2"
})(["padding:", " ", ";background:", ";border-style:solid;border-width:0 1px 1px 1px;border-color:", ";"], ({
  theme
}) => theme.space.lg, ({
  theme
}) => theme.space.xl, ({
  theme
}) => theme.colors.white, ({
  theme
}) => theme.colors.successLight);
/**
 * Prop Types of a MessageBox component.
 * Apart from those defined below it extends all {@link SpaceProps}
 *
 * @memberof MessageBox
 * @alias MessageBoxProps
 */

/**
 * Component responsible for rendering standard danger/info/success
 * messages.
 *
 * It has 2 size versions: default and small. Also it can either contain or
 * don't contain children, which causes different look.
 *
 * Usage
 * ```javascript
 * import { MessageBox, MessageBoxProps } from 'admin-bro'
 * ```
 *
 * @component
 * @subcategory Molecules
 * @example <caption>Different variants</caption>
 * return (
 *  <Box py="lg">
 *   <MessageBox message="Some default message" onCloseClick={() => alert('close clicked')} />
 *   <MessageBox message="Error message" mt="default" variant="danger" onCloseClick={() => alert('close clicked')} />
 *   <MessageBox message="Info message" mt="default" variant="info" onCloseClick={() => alert('close clicked')} />
 *  </Box>
 * )
 * @example <caption>Different variants with children</caption>
 * return (
 *  <Box py="lg">
 *   <MessageBox message="Some default message" onCloseClick={() => alert('close clicked')}>
 *     With inside text
 *   </MessageBox>
 *   <MessageBox message="Error message" mt="default" variant="danger" onCloseClick={() => alert('close clicked')}>
 *     With inside text
 *   </MessageBox>
 *   <MessageBox message="Info message" mt="default" variant="info" onCloseClick={() => alert('close clicked')}>
 *     With inside text
 *   </MessageBox>
 *  </Box>
 * )
 * @example <caption>Small with an icon and inside text</caption>
 * return (
 *  <Box py="lg">
 *   <MessageBox
 *     size="sm"
 *     message="Info message"
 *     mt="default"
 *     variant="info"
 *     icon="AddComment"
 *     onCloseClick={() => alert('close clicked')}
 *   >
 *     With inside text
 *   </MessageBox>
 *  </Box>
 * )
 */
const MessageBox = props => {
  const {
    onCloseClick,
    message,
    icon,
    children,
    variant,
    size
  } = props,
        other = _objectWithoutProperties(props, ["onCloseClick", "message", "icon", "children", "variant", "size"]);

  return /*#__PURE__*/_react.default.createElement(_box.Box, _extends({
    className: (0, _cssClass.cssClass)('MessageBox')
  }, other), /*#__PURE__*/_react.default.createElement(StyledMessageBox, {
    variant: variant,
    size: size
  }, onCloseClick ? /*#__PURE__*/_react.default.createElement(_button.Button, {
    variant: "text",
    size: "icon",
    onClick: onCloseClick
  }, /*#__PURE__*/_react.default.createElement(_icon.Icon, {
    icon: "Close"
  })) : '', /*#__PURE__*/_react.default.createElement(StyledCaption, null, icon ? /*#__PURE__*/_react.default.createElement(_icon.Icon, {
    icon: icon,
    mr: "default"
  }) : '', message)), children ? /*#__PURE__*/_react.default.createElement(StyledChildren, null, children) : '');
};

exports.MessageBox = MessageBox;
var _default = MessageBox;
exports.default = _default;