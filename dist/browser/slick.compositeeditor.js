"use strict";
(() => {
  // src/slick.compositeeditor.ts
  var Utils = Slick.Utils;
  function SlickCompositeEditor(columns, containers, options) {
    let defaultOptions = {
      modalType: "edit",
      // available type (create, edit, mass)
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
      var _a, _b, _c, _d;
      let c = containers[i], offset = Slick.Utils.offset(c), w = Slick.Utils.width(c), h = Slick.Utils.height(c);
      return {
        top: (_a = offset == null ? void 0 : offset.top) != null ? _a : 0,
        left: (_b = offset == null ? void 0 : offset.left) != null ? _b : 0,
        bottom: ((_c = offset == null ? void 0 : offset.top) != null ? _c : 0) + (h || 0),
        right: ((_d = offset == null ? void 0 : offset.left) != null ? _d : 0) + (w || 0),
        width: w,
        height: h,
        visible: !0
      };
    }
    function editor(args) {
      let context = this, editors = [];
      function init() {
        let newArgs = {}, idx = 0;
        for (; idx < columns.length; ) {
          if (columns[idx].editor) {
            let column = columns[idx];
            newArgs = Slick.Utils.extend(!1, {}, args), newArgs.container = containers[idx], newArgs.column = column, newArgs.position = getContainerBox(idx), newArgs.commitChanges = noop, newArgs.cancelChanges = noop, newArgs.compositeEditorOptions = options, newArgs.formValues = {};
            let currentEditor = new column.editor(newArgs);
            options.editors[column.id] = currentEditor, editors.push(currentEditor);
          }
          idx++;
        }
        setTimeout(function() {
          Array.isArray(editors) && editors.length > 0 && typeof editors[0].focus == "function" && editors[0].focus();
        }, 0);
      }
      context.destroy = () => {
        var _a;
        let idx = 0;
        for (; idx < editors.length; )
          editors[idx].destroy(), idx++;
        (_a = options.destroy) == null || _a.call(options), editors = [];
      }, context.focus = () => {
        (firstInvalidEditor || editors[0]).focus();
      }, context.isValueChanged = () => {
        let idx = 0;
        for (; idx < editors.length; ) {
          if (editors[idx].isValueChanged())
            return !0;
          idx++;
        }
        return !1;
      }, context.serializeValue = () => {
        let serializedValue = [], idx = 0;
        for (; idx < editors.length; )
          serializedValue[idx] = editors[idx].serializeValue(), idx++;
        return serializedValue;
      }, context.applyValue = (item, state) => {
        let idx = 0;
        for (; idx < editors.length; )
          editors[idx].applyValue(item, state[idx]), idx++;
      }, context.loadValue = (item) => {
        let idx = 0;
        for (; idx < editors.length; )
          editors[idx].loadValue(item), idx++;
      }, context.validate = (target) => {
        var _a, _b;
        let validationResults, errors = [], targetElm = target || null;
        firstInvalidEditor = null;
        let idx = 0;
        for (; idx < editors.length; ) {
          let columnDef = (_b = (_a = editors[idx].args) == null ? void 0 : _a.column) != null ? _b : {};
          if (columnDef) {
            let validationElm = document.querySelector(`.item-details-validation.editor-${columnDef.id}`), labelElm = document.querySelector(`.item-details-label.editor-${columnDef.id}`), editorElm = document.querySelector(`[data-editorid=${columnDef.id}]`), validationMsgPrefix = (options == null ? void 0 : options.validationMsgPrefix) || "";
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
      }, context.hide = () => {
        var _a, _b, _c;
        let idx = 0;
        for (; idx < editors.length; )
          (_b = (_a = editors[idx]) == null ? void 0 : _a.hide) == null || _b.call(_a), idx++;
        (_c = options == null ? void 0 : options.hide) == null || _c.call(options);
      }, context.show = () => {
        var _a, _b, _c;
        let idx = 0;
        for (; idx < editors.length; )
          (_b = (_a = editors[idx]) == null ? void 0 : _a.show) == null || _b.call(_a), idx++;
        (_c = options == null ? void 0 : options.show) == null || _c.call(options);
      }, context.position = (box) => {
        var _a;
        (_a = options == null ? void 0 : options.position) == null || _a.call(options, box);
      }, init();
    }
    return editor.prototype = this, editor;
  }
  window.Slick && Utils.extend(Slick, {
    CompositeEditor: SlickCompositeEditor
  });
})();
//# sourceMappingURL=slick.compositeeditor.js.map
