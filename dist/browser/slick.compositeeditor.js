"use strict";
(() => {
  // src/slick.compositeeditor.js
  var Utils = Slick.Utils;
  function CompositeEditor(columns, containers, options) {
    var defaultOptions = {
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
    }, firstInvalidEditor;
    options = Slick.Utils.extend({}, defaultOptions, options);
    function getContainerBox(i) {
      var c = containers[i], offset = Slick.Utils.offset(c), w = Slick.Utils.width(c), h = Slick.Utils.height(c);
      return {
        top: offset && offset.top,
        left: offset && offset.left,
        bottom: offset && offset.top + h,
        right: offset && offset.left + w,
        width: w,
        height: h,
        visible: !0
      };
    }
    function editor(args) {
      var editors = [];
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
          Array.isArray(editors) && editors.length > 0 && editors[0].focus && editors[0].focus();
        }, 0);
      }
      this.destroy = function() {
        for (var idx = 0; idx < editors.length; )
          editors[idx].destroy(), idx++;
        options.destroy && options.destroy(), editors = [];
      }, this.focus = function() {
        (firstInvalidEditor || editors[0]).focus();
      }, this.isValueChanged = function() {
        for (var idx = 0; idx < editors.length; ) {
          if (editors[idx].isValueChanged())
            return !0;
          idx++;
        }
        return !1;
      }, this.serializeValue = function() {
        for (var serializedValue = [], idx = 0; idx < editors.length; )
          serializedValue[idx] = editors[idx].serializeValue(), idx++;
        return serializedValue;
      }, this.applyValue = function(item, state) {
        for (var idx = 0; idx < editors.length; )
          editors[idx].applyValue(item, state[idx]), idx++;
      }, this.loadValue = function(item) {
        for (var idx = 0; idx < editors.length; )
          editors[idx].loadValue(item), idx++;
      }, this.validate = function(target) {
        var validationResults, errors = [], targetElm = target || null;
        firstInvalidEditor = null;
        for (var idx = 0; idx < editors.length; ) {
          var columnDef = editors[idx].args && editors[idx].args.column || {};
          if (columnDef) {
            var validationElm = document.querySelector(".item-details-validation.editor-" + columnDef.id), labelElm = document.querySelector(".item-details-label.editor-" + columnDef.id), editorElm = document.querySelector("[data-editorid=" + columnDef.id + "]"), validationMsgPrefix = options && options.validationMsgPrefix || "";
            (!targetElm || Slick.Utils.contains(editorElm, targetElm)) && (validationResults = editors[idx].validate(), validationResults.valid ? validationElm && (validationElm.textContent = "", editorElm.classList.remove("invalid"), labelElm.classList.remove("invalid")) : (firstInvalidEditor = editors[idx], errors.push({
              index: idx,
              editor: editors[idx],
              container: containers[idx],
              msg: validationResults.msg
            }), validationElm && (validationElm.textContent = validationMsgPrefix + validationResults.msg, labelElm.classList.add("invalid"), editorElm.classList.add("invalid")))), validationElm = null, labelElm = null, editorElm = null;
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
      }, this.hide = function() {
        for (var idx = 0; idx < editors.length; )
          editors[idx].hide && editors[idx].hide(), idx++;
        options.hide && options.hide();
      }, this.show = function() {
        for (var idx = 0; idx < editors.length; )
          editors[idx].show && editors[idx].show(), idx++;
        options.show && options.show();
      }, this.position = function(box) {
        options.position && options.position(box);
      }, init();
    }
    return editor.prototype = this, editor;
  }
  window.Slick && Utils.extend(Slick, {
    CompositeEditor
  });
})();
