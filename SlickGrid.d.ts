export {}; // Declare this to hint this is a module.

declare global {
  interface Window {
    jQuery: JQuery;
  }
}
