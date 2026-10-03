// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@4tw/cypress-drag-drop';
import 'cypress-real-events';
import './drag'; // overwrites the drag command and registers drag helpers globally
import { convertPosition } from './common';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // triggerHover: (elements: NodeListOf<HTMLElement>) => void;
      convertPosition(viewport: string): Chainable<{ x: string; y: string }>;
      getCell(
        row: number,
        col: number,
        viewport?: string,
        options?: { parentSelector?: string; rowHeight?: number }
      ): Chainable<JQuery<HTMLElement>>;
      getNthCell(
        row: number,
        nthCol: number,
        viewport?: string,
        options?: { parentSelector?: string; rowHeight?: number }
      ): Chainable<JQuery<HTMLElement>>;
      restoreLocalStorage(): Chainable<void>;
      saveLocalStorage(): Chainable<void>;
    }
  }
}

// convert position like 'topLeft' to the object { x: 'left|right', y: 'top|bottom' }
Cypress.Commands.add('convertPosition', (viewport = 'topLeft') => cy.wrap(convertPosition(viewport)));

// The grid renders a single viewport, so the legacy `viewport` argument is kept only for call-site compatibility.
Cypress.Commands.add('getCell', (row, col, _viewport = 'topLeft', { parentSelector = '' } = {}) => {
  return cy.get(`${parentSelector} .slick-row[data-row="${row}"] .slick-cell.l${col}.r${col}`);
});

// `nthCol` is the column index (the cell's `.lN.rN` classes), not a DOM child position.
Cypress.Commands.add('getNthCell', (row, nthCol, _viewport = 'topLeft', { parentSelector = '' } = {}) => {
  return cy.get(`${parentSelector} .slick-row[data-row="${row}"] .slick-cell.l${nthCol}.r${nthCol}`);
});

const LOCAL_STORAGE_MEMORY: Record<string, string | null> = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage.getItem(key);
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    const value = LOCAL_STORAGE_MEMORY[key];
    if (value !== null) {
      localStorage.setItem(key, value);
    }
  });
});
