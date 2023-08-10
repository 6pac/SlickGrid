"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // import-ns:./slick.core.js
  var require_slick_core = __commonJS({
    "import-ns:./slick.core.js"() {
    }
  });

  // src/slick.compositeeditor.js
  var require_slick_compositeeditor = __commonJS({
    "src/slick.compositeeditor.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: !0 });
      exports.SlickCompositeEditor = void 0;
      var slick_core_1 = require_slick_core(), Utils = Slick.Utils;
      function SlickCompositeEditor(columns, containers, options) {
        var defaultOptions = {
          modalType: "edit",
          validationFailedMsg: "Some of the fields have failed validation",
          validationMsgPrefix: null,
          show: null,
          hide: null,
          position: null,
          destroy: null,
          formValues: {},
          editors: {}
        }, noop = function() {
        }, firstInvalidEditor = null;
        options = Slick.Utils.extend({}, defaultOptions, options);
        function getContainerBox(i) {
          var _a, _b, _c, _d, c = containers[i], offset = Slick.Utils.offset(c), w = Slick.Utils.width(c), h = Slick.Utils.height(c);
          return {
            top: (_a = offset == null ? void 0 : offset.top) !== null && _a !== void 0 ? _a : 0,
            left: (_b = offset == null ? void 0 : offset.left) !== null && _b !== void 0 ? _b : 0,
            bottom: ((_c = offset == null ? void 0 : offset.top) !== null && _c !== void 0 ? _c : 0) + (h || 0),
            right: ((_d = offset == null ? void 0 : offset.left) !== null && _d !== void 0 ? _d : 0) + (w || 0),
            width: w,
            height: h,
            visible: !0
          };
        }
        function editor(args) {
          var context = this, editors = [];
          function init() {
            for (var newArgs = {}, idx = 0; idx < columns.length; ) {
              if (columns[idx].editor) {
                var column = columns[idx];
                newArgs = Slick.Utils.extend(!1, {}, args), newArgs.container = containers[idx], newArgs.column = column, newArgs.position = getContainerBox(idx), newArgs.commitChanges = noop, newArgs.cancelChanges = noop, newArgs.compositeEditorOptions = options, newArgs.formValues = {};
                var currentEditor = new column.editor(newArgs);
                options.editors[column.id] = currentEditor, editors.push(currentEditor);
              }
              idx++;
            }
            setTimeout(function() {
              Array.isArray(editors) && editors.length > 0 && typeof editors[0].focus == "function" && editors[0].focus();
            }, 0);
          }
          context.destroy = function() {
            for (var _a, idx = 0; idx < editors.length; )
              editors[idx].destroy(), idx++;
            (_a = options.destroy) === null || _a === void 0 || _a.call(options), editors = [];
          }, context.focus = function() {
            (firstInvalidEditor || editors[0]).focus();
          }, context.isValueChanged = function() {
            for (var idx = 0; idx < editors.length; ) {
              if (editors[idx].isValueChanged())
                return !0;
              idx++;
            }
            return !1;
          }, context.serializeValue = function() {
            for (var serializedValue = [], idx = 0; idx < editors.length; )
              serializedValue[idx] = editors[idx].serializeValue(), idx++;
            return serializedValue;
          }, context.applyValue = function(item, state) {
            for (var idx = 0; idx < editors.length; )
              editors[idx].applyValue(item, state[idx]), idx++;
          }, context.loadValue = function(item) {
            for (var idx = 0; idx < editors.length; )
              editors[idx].loadValue(item), idx++;
          }, context.validate = function(target) {
            var _a, _b, validationResults, errors = [], targetElm = target || null;
            firstInvalidEditor = null;
            for (var idx = 0; idx < editors.length; ) {
              var columnDef = (_b = (_a = editors[idx].args) === null || _a === void 0 ? void 0 : _a.column) !== null && _b !== void 0 ? _b : {};
              if (columnDef) {
                var validationElm = document.querySelector(".item-details-validation.editor-".concat(columnDef.id)), labelElm = document.querySelector(".item-details-label.editor-".concat(columnDef.id)), editorElm = document.querySelector("[data-editorid=".concat(columnDef.id, "]")), validationMsgPrefix = (options == null ? void 0 : options.validationMsgPrefix) || "";
                (!targetElm || Slick.Utils.contains(editorElm, targetElm)) && (validationResults = editors[idx].validate(), validationResults.valid ? validationElm && (validationElm.textContent = "", editorElm == null || editorElm.classList.remove("invalid"), labelElm == null || labelElm.classList.remove("invalid")) : (firstInvalidEditor = editors[idx], errors.push({
                  index: idx,
                  editor: editors[idx],
                  container: containers[idx],
                  msg: validationResults.msg
                }), validationElm && (validationElm.textContent = validationMsgPrefix + validationResults.msg, labelElm == null || labelElm.classList.add("invalid"), editorElm == null || editorElm.classList.add("invalid")))), validationElm = null, labelElm = null, editorElm = null;
              }
              idx++;
            }
            return targetElm = null, errors.length ? {
              valid: !1,
              msg: options.validationFailedMsg,
              errors
            } : {
              valid: !0,
              msg: ""
            };
          }, context.hide = function() {
            for (var _a, _b, _c, idx = 0; idx < editors.length; )
              (_b = (_a = editors[idx]) === null || _a === void 0 ? void 0 : _a.hide) === null || _b === void 0 || _b.call(_a), idx++;
            (_c = options == null ? void 0 : options.hide) === null || _c === void 0 || _c.call(options);
          }, context.show = function() {
            for (var _a, _b, _c, idx = 0; idx < editors.length; )
              (_b = (_a = editors[idx]) === null || _a === void 0 ? void 0 : _a.show) === null || _b === void 0 || _b.call(_a), idx++;
            (_c = options == null ? void 0 : options.show) === null || _c === void 0 || _c.call(options);
          }, context.position = function(box) {
            var _a;
            (_a = options == null ? void 0 : options.position) === null || _a === void 0 || _a.call(options, box);
          }, init();
        }
        return editor.prototype = this, editor;
      }
      exports.SlickCompositeEditor = SlickCompositeEditor;
      window.Slick && Utils.extend(Slick, {
        CompositeEditor: SlickCompositeEditor
      });
    }
  });
  require_slick_compositeeditor();
})();
//# sourceMappingURL=slick.compositeeditor.js.map
