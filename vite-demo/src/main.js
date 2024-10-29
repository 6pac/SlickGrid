import 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Sortable from 'sortablejs';

import { init, render } from './example4.js';
import './style.scss';

// assign SortableJS to the Window object
window.Sortable = Sortable;

// load example html, assign it to App and then init the JS code
document.querySelector('#app').innerHTML = render();
init();