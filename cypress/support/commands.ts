/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("login", () => {
  cy.session("user-session", () => {
    cy.visit("/login");

    cy.intercept("GET", "/sanctum/csrf-cookie").as("csrf");
    cy.intercept("POST", "/api/login").as("login");
    cy.intercept("GET", "/api/user").as("user");

    cy.get("#login-email").type("admin@vensura.co");
    cy.get("#login-password").type("vensura@123");

    cy.get("#login-click").click();

    cy.wait("@csrf");
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    // optional but recommended
    cy.wait("@user").its("response.statusCode").should("eq", 200);
  });
});