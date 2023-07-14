// import Sortable from '../node_modules/sortablejs/Sortable.js';

function fallback() {
  console.log('use local SortableJS CDN fallback');
  var element = document.createElement('script');
  // element.setAttribute('defer', true);
  // element.type = 'text/javascript';
  element.src = '../node_modules/sortablejs/Sortable.min.js'; // or your path to your local script
  document.body.appendChild(element);
}

// allow using SortableJS from CDN or fallback to "node_modules/sortablejs"
window.Sortable || fallback();