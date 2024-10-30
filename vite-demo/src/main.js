import 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Sortable from 'sortablejs';

import { ExampleTrading } from './example-trading.js';
import { Example4 } from './example4.js';
import './style.scss';

// assign SortableJS to the Window object
window.Sortable = Sortable;

// load example html, assign it to App and then init the JS code
document.querySelector('#app').innerHTML =
  `<div id="router">
    <div class="router-link" id="trading">Realtime Trading</div>
    <div class="router-link" id="example4">Example 4</div>
    <div class="router-link">
      <span class="sgi sgi-lightbulb"></span>
      <a href="https://github.com/6pac/SlickGrid/wiki/Examples" target="__blank" title="for many more examples, please visit the project Examples Wiki">
        Visit Examples Wikis
      </a>
    </div>
  </div>
  <div id="router-view"></div>`;

// load default example
let currentExample;
currentExample = loadTradingExample();

document.querySelector('#trading').addEventListener('click', () => currentExample = loadTradingExample());
document.querySelector('#example4').addEventListener('click', () => currentExample = loadExample4());

function loadTradingExample() {
  destroyPreviousExample();
  const trading = new ExampleTrading();
  document.querySelector('#router-view').innerHTML = trading.render();
  trading.init();
  return trading;
}

function loadExample4() {
  destroyPreviousExample();
  const demo4 = new Example4();
  document.querySelector('#router-view').innerHTML = demo4.render();
  demo4.init();
  return demo4;
}

function destroyPreviousExample() {
  if (currentExample?.destroy) {
    currentExample.destroy();
  }
}