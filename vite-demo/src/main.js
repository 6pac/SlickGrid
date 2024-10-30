import 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Sortable from 'sortablejs';

import { Example4 } from './example4.js';
import './style.scss';

// assign SortableJS to the Window object
window.Sortable = Sortable;

// load example html, assign it to App and then init the JS code
const demo4 = new Example4();
document.querySelector('#app').innerHTML = demo4.render();
demo4.init();