describe("Item Update", () => {
  beforeEach(() => {
    cy.login();
  });
  it("Item Update Flow", () => {
    cy.visit("/edit-item/10");

    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");
    cy.intercept("GET", "/api/items/10").as("Get-Item");
    cy.wait("@Get-Item");
    cy.intercept("PUT", "/api/items/10").as("Update-Item");

    cy.get('[data-cy="itc-title"]').contains("Edit Item");

    // breadcrumb
    cy.get(".itc-bc-parent").click();
    cy.url().should("eq", "http://localhost:5173/items");
    cy.visit("/edit-item/10");
    cy.get(".itc-bc-child").contains("Edit item");

    // form
    cy.get("#itc-name-title").contains("Item Name");
    cy.get('[data-cy="itc-name"]').clear().type("Item Update");
    cy.get("#itc-price-title").contains("Price");
    cy.get('[data-cy="itc-price"]').clear().type(69);
    cy.get("#itc-description-title").contains("Description");
    cy.get('[data-cy="itc-description"]').clear().type("This is Item Update");

    cy.get('[data-cy="itc-submit"]').click();
    cy.contains("Item Updated Successfully");
    cy.wait("@Update-Item");

    cy.contains("Item Updated Successfully");
    cy.url().should("eq", "http://localhost:5173/items");
  });

  it("Item Update with Blank data", () => {
    cy.visit("/edit-item/10");

    cy.intercept("GET", "/api/items/10").as("Get-Item");
    cy.wait("@Get-Item");

    // form
    cy.get("#itc-name-title").contains("Item Name");
    cy.get('[data-cy="itc-name"]').clear().type(" ");
    cy.get("#itc-price-title").contains("Price");
    cy.get('[data-cy="itc-price"]').clear().type(-1);
    cy.get("#itc-description-title").contains("Description");
    cy.get('[data-cy="itc-description"]').clear().type(" ");

    cy.get('[data-cy="itc-submit"]').click();
  });
});
