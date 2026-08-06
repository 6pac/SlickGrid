/**
 * Regression test for the fractional-grid-height bottom-render bug (issue #1262).
 *
 * When the grid container height has a decimal part below .5, the browser's maximum
 * scrollTop (`scrollHeight - clientHeight`, integer-rounded) is slightly LARGER than
 * the ceiling `scrollTo()` clamps to (`th - getBoundingClientRect().height + …`,
 * fractional). So a mouse wheel that overshoots the bottom lands on a scrollTop that
 * `scrollTo()` then lowers, which makes `prevScrollTop !== newScrollTop` and takes the
 * "position moved" branch. That branch used to assign `lastRenderedScrollTop` as if a
 * render had happened; back in `_handleScroll()` the scroll delta `dy` was therefore 0
 * and the `dy > 20` render was skipped — leaving the rows the previous render had
 * cleaned up permanently missing (the bare viewport shows through at the bottom).
 *
 * The spec is SELF-HOSTING: the repro harness page is served from this file via
 * cy.intercept (no page is added to examples/). It reproduces the issue's exact
 * geometry (450 x 430.1px, rowHeight 20, 100 rows), wheels up ~220px so the bottom
 * rows get cleaned up, then wheels back down past the bottom in a single event.
 * FAILS on the unfixed code (rows 94-99 never render) and PASSES with the fix.
 */

const harnessHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Harness: fractional grid height bottom render</title>
  <link rel="stylesheet" href="/dist/styles/css/slick.grid.css"/>
  <link rel="stylesheet" href="/dist/styles/css/slick-default-theme.css"/>
  <style>
    /* the fractional height is the whole point - decimal part below .5 */
    #myGrid { width: 450px; height: 430.1px; }
    .slick-viewport { background: #ff0000 !important; }
  </style>
</head>
<body>
<div id="myGrid"></div>
<script src="/dist/browser/slick.core.js"></script>
<script src="/dist/browser/slick.interactions.js"></script>
<script src="/dist/browser/slick.grid.js"></script>
<script>
  var ROW_HEIGHT = 20, ROW_COUNT = 100;
  var data = [];
  for (var i = 0; i < ROW_COUNT; i++) { data.push({ id: i, no: i, text: 'row ' + i }); }

  window.grid = new Slick.Grid('#myGrid', data, [
    { id: 'no', name: 'no', field: 'no', width: 100 },
    { id: 'text', name: 'text', field: 'text', width: 350 }
  ], {
    rowHeight: ROW_HEIGHT,
    enableColumnReorder: false   // keep the harness free of the SortableJS dependency
  });

  window.viewportEl = function () { return document.querySelector('#myGrid .slick-viewport'); };

  /* dispatch a wheel event the way SlickGrid's MouseWheel service reads it (it uses the
     legacy wheelDelta properties, which a synthetic WheelEvent does not derive on its own).
     notches > 0 scrolls UP, notches < 0 scrolls DOWN, 1 notch === 1 row. */
  window.wheel = function (notches) {
    var ev = new WheelEvent('wheel', { deltaY: -notches * 100, bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'wheelDelta', { value: notches * 120 });
    Object.defineProperty(ev, 'wheelDeltaY', { value: notches * 120 });
    Object.defineProperty(ev, 'wheelDeltaX', { value: 0 });
    window.viewportEl().dispatchEvent(ev);
  };

  window.hasRow = function (row) { return !!document.querySelector('#myGrid .slick-row[data-row="' + row + '"]'); };

  /* row indexes the viewport currently shows that have no rendered row node */
  window.missingRows = function () {
    var vp = window.viewportEl();
    var first = Math.floor(vp.scrollTop / ROW_HEIGHT);
    var last = Math.min(ROW_COUNT - 1, Math.ceil((vp.scrollTop + vp.clientHeight) / ROW_HEIGHT) - 1);
    var missing = [];
    for (var r = first; r <= last; r++) { if (!window.hasRow(r)) { missing.push(r); } }
    return missing;
  };
</script>
</body>
</html>`;

describe('Quirk - a fractional grid height must still render the bottom rows', { retries: 1 }, () => {
  it('should reproduce the geometry that triggers the bug and keep every visible row rendered', () => {
    cy.intercept('GET', '/quirk-fractional-height-bottom-render-harness.html', {
      headers: { 'content-type': 'text/html' },
      body: harnessHtml,
    });
    cy.visit(`${Cypress.config('baseUrl')}/quirk-fractional-height-bottom-render-harness.html`);
    cy.window().its('grid').should('exist');

    cy.window().then((win: any) => {
      const vp = win.viewportEl();

      // precondition: the browser lets us scroll further down than the ceiling
      // `scrollTo()` clamps to. Without that sub-pixel gap the bug cannot occur
      // (which is exactly why an integer or `.5+` height never reproduces it).
      vp.scrollTop = 1e9;
      const domMaxScrollTop = vp.scrollTop;
      win.grid.scrollTo(1e9);
      const gridMaxScrollTop = win.grid.scrollTop;
      expect(domMaxScrollTop, `DOM max scrollTop vs grid clamp (${gridMaxScrollTop})`).to.be.greaterThan(gridMaxScrollTop);

      // start from a fully rendered bottom, then wheel up far enough that the render
      // buffer no longer covers the last rows - they must actually be cleaned up,
      // otherwise the wheel-back-down below could not expose anything.
      win.grid.render();
      win.wheel(11);
      expect(win.hasRow(99), 'last row cleaned up by the wheel-up render').to.eq(false);

      // ...then scroll back down past the bottom in a single wheel event
      win.wheel(-24);
    });

    // the bug does not self-heal: give the trailing native scroll event time to fire
    cy.wait(200);
    cy.window().then((win: any) => {
      expect(win.missingRows(), 'visible rows left unrendered at the bottom').to.deep.eq([]);
    });
  });
});
