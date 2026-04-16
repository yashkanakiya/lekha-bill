describe("Item Index", () => {
  beforeEach(() => {
    cy.login();
  });
  it("Item Index Flow", () => {
    cy.visit("/items");

    cy.intercept("GET", "/api/items").as("List-Item");
    cy.wait("@List-Item");

    cy.get('[data-cy="itl-title"]');
    cy.contains("Create Item");

    cy.get('[data-cy="action-1"]').click();
    cy.get(".menu-edit").click();
    cy.url().should("eq", "http://localhost:5173/edit-item/1");
    cy.get(".it-bc-child").should("have.text", "Edit item");
    cy.get(".it-bc-parent").click();

    cy.get('[data-cy="action-1"]').click();
    cy.get(".menu-delete").click();
    cy.contains("Are you sure you want to delete this item?");
    cy.contains("Cancel").click();

    cy.get('[data-cy="action-1"]').click();
    cy.get(".menu-delete").click();
    cy.contains("Are you sure you want to delete this item?");
    cy.get('[data-cy="cnf-del"]').click();
    cy.intercept("DELETE", "/api/items/1").as("Delete-Item");
    cy.wait("@Delete-Item");
  });
});
