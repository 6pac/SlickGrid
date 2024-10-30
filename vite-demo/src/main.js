import 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Sortable from 'sortablejs';

import { ExampleTrading } from './example-trading.js';
import { Example4 } from './example4.js';
import './style.scss';

// assign SortableJS to the Window object
window.Sortable = Sortable;

// create simple router & container to change displayed example
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
currentExample = loadExample(new ExampleTrading());

document.querySelector('#trading').addEventListener('click', () => currentExample = loadExample(new ExampleTrading()));
document.querySelector('#example4').addEventListener('click', () => currentExample = loadExample(new Example4()));

/** load a new example in the DOM and initialize it but destroy any previous example if any */
function loadExample(example) {
  destroyPreviousExample();
  document.querySelector('#router-view').innerHTML = example.render();
  example.init();
  return example;
}

/** if a previous example was loaded, destroy it before loading the new one */
function destroyPreviousExample() {
  if (currentExample?.destroy) {
    currentExample.destroy();
  }
}