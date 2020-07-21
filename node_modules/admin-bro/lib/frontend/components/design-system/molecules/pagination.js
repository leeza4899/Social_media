"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Pagination = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _jwPaginate = _interopRequireDefault(require("jw-paginate"));

var _box = require("../atoms/box");

var _button = require("../atoms/button");

var _icon = require("../atoms/icon");

var _cssClass = require("../utils/css-class");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const PaginationLink = (0, _styledComponents.default)(_button.Button).attrs(props => ({
  size: 'icon',
  variant: props.variant ? props.variant : 'text'
})).withConfig({
  displayName: "pagination__PaginationLink",
  componentId: "mldysb-0"
})(["min-width:28px;height:28px;line-height:12px;padding:3px 6px;text-align:center;"]);
PaginationLink.defaultProps = {
  className: (0, _cssClass.cssClass)('PaginationLink')
};
const PaginationWrapper = (0, _styledComponents.default)(_box.Box).withConfig({
  displayName: "pagination__PaginationWrapper",
  componentId: "mldysb-1"
})(["display:inline-block;padding:2px;border:1px solid ", ";& >:first-child{width:56px;border-right:1px solid ", ";}& >:nth-child(2){padding-left:16px;}& >:last-child{width:56px;border-left:1px solid ", ";}& >:nth-last-child(2){padding-right:16px;}"], ({
  theme
}) => theme.colors.grey20, ({
  theme
}) => theme.colors.grey20, ({
  theme
}) => theme.colors.grey20);
/**
 * Pagination component
 *
 * @component
 * @subcategory Molecules
 * @example
 * const location = { search: ''}
 * return (
 *   <Text py="xl" textAlign="center">
 *     <Pagination
 *      total={100}
 *      page={4}
 *      perPage={10}
 *      location={location}
 *      onChange={(item) => alert(`clicked ${item}`)}
 *   />
 *   </Text>
 * )
 */

const Pagination = props => {
  const {
    total,
    page,
    perPage,
    onChange
  } = props,
        rest = _objectWithoutProperties(props, ["total", "page", "perPage", "onChange"]);

  const currentPage = page || 1;
  const paginate = (0, _jwPaginate.default)(total, currentPage, perPage);
  const isFirstPage = currentPage === paginate.startPage;
  const isLastPage = currentPage === paginate.endPage;
  const prevPage = isFirstPage ? currentPage : currentPage - 1;
  const nextPage = isLastPage ? currentPage : currentPage + 1;

  if (paginate.totalPages === 1 || total === 0) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(PaginationWrapper, _extends({
    className: (0, _cssClass.cssClass)('Pagination')
  }, rest), /*#__PURE__*/_react.default.createElement(PaginationLink, {
    "data-testid": "previous",
    disabled: isFirstPage,
    onClick: () => !isFirstPage ? onChange(prevPage) : undefined
  }, /*#__PURE__*/_react.default.createElement(_icon.Icon, {
    icon: "ChevronLeft"
  })), paginate.pages.map(p => /*#__PURE__*/_react.default.createElement(PaginationLink, {
    key: p,
    onClick: () => onChange(p),
    variant: p === currentPage ? 'primary' : 'text',
    className: (0, _cssClass.cssClass)('PaginationLink', p === currentPage ? 'current' : ''),
    "data-testid": `page-${p}`
  }, p)), /*#__PURE__*/_react.default.createElement(PaginationLink, {
    "data-testid": "next",
    onClick: () => !isLastPage ? onChange(nextPage) : undefined,
    disabled: isLastPage
  }, /*#__PURE__*/_react.default.createElement(_icon.Icon, {
    icon: "ChevronRight"
  })));
};

exports.Pagination = Pagination;
var _default = Pagination;
exports.default = _default;