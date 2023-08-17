"use strict";
(() => {
  // cypress/support/common.ts
  var POSITION = Object.freeze({
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    RIGHT: "right"
  });
  function convertPosition(position) {
    let x = "", y = "", _position = position.toLowerCase();
    return _position.includes(POSITION.LEFT) ? x = POSITION.LEFT : _position.includes(POSITION.RIGHT) && (x = POSITION.RIGHT), _position.includes(POSITION.TOP) ? y = POSITION.TOP : _position.includes(POSITION.BOTTOM) && (y = POSITION.BOTTOM), { x, y };
  }
})();
//# sourceMappingURL=common.js.map
