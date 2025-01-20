import 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Sortable from 'sortablejs';

import { ExampleTrading } from './example-trading.js';
import { Example4 } from './example4.js';
import { ExampleGrouping } from './example-grouping.js';
import './style.scss';

// assign SortableJS to the Window object
window.Sortable = Sortable;

// create simple router & container to change displayed example
document.querySelector('#app').innerHTML =
  `<div id="router">
    <div class="router-link" id="trading">1. Realtime Trading</div>
    <div class="router-link" id="example4">2. Example with DataView</div>
    <div class="router-link" id="example-grouping">3. Example Grouping</div>
    <div class="router-link">
      <span class="sgi sgi-lightbulb"></span>
      <a href="https://github.com/6pac/SlickGrid/wiki/Examples" target="__blank" title="for many more examples, please visit the project Examples Wiki">
        Visit Examples Wiki
      </a>
    </div>
  </div>
  <div id="router-view"></div>`;

// load default example
let currentExample;
currentExample = loadExample('trading', new ExampleTrading());

document.querySelector('#trading').addEventListener('click', () => currentExample = loadExample('trading', new ExampleTrading()));
document.querySelector('#example4').addEventListener('click', () => currentExample = loadExample('example4', new Example4()));
document.querySelector('#example-grouping').addEventListener('click', () => currentExample = loadExample('example-grouping', new ExampleGrouping()));

/** load a new example in the DOM and initialize it but destroy any previous example if any */
function loadExample(exampleId, exampleInstance) {
  destroyPreviousExample();
  document.querySelector(`#${exampleId}`).classList.add('active');
  document.querySelector('#router-view').innerHTML = exampleInstance.render();
  exampleInstance.init();
  return exampleInstance;
}

/** if a previous example was loaded, destroy it before loading the new one */
function destroyPreviousExample() {
  document.querySelectorAll('.router-link').forEach(route => route.classList.remove('active'));
  if (currentExample?.destroy) {
    currentExample.destroy();
  }
}
