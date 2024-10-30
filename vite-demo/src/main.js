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
  </div>
  <div id="router-view"></div>`;

// load default example
loadTradingExample()

document.querySelector('#trading').addEventListener('click', () => loadTradingExample());
document.querySelector('#example4').addEventListener('click', () => loadExample4());

function loadTradingExample() {
  const trading = new ExampleTrading();
  document.querySelector('#router-view').innerHTML = trading.render();
  trading.init();
}

function loadExample4() {
  const demo4 = new Example4();
  document.querySelector('#router-view').innerHTML = demo4.render();
  demo4.init();
}