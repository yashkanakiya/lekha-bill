describe("Item Update", () => {
  beforeEach(() => {
    cy.login();
  });
  it("Item Update Flow", () => {
    cy.visit("/edit-item/1");

    cy.intercept("GET", "/api/items/1").as("Get-Item");
    cy.wait("@Get-Item");
    
    cy.get('[data-cy="itc-title"]');
    cy.contains("Edit Item");
    
    cy.get("#itc-name").clear().type("Item Update");
    cy.get("#itc-price").clear().type(69);
    cy.get("#itc-description").clear().type("This is Item Update");

    cy.get('[data-cy="itc-btn"]').click();
    cy.intercept("PUT", "/api/items/1")
    
    cy.contains("Item Updated Successfully")
    cy.url().should("eq", "http://localhost:5173/items");
  });

  it("Item Update with Blank data", () => {
    cy.visit("/edit-item/1");

     cy.intercept("GET", "/api/items/1").as("Get-Item");
     cy.wait("@Get-Item");

    cy.get("#itc-name").clear()
    cy.get("#itc-price").clear().type(-1);
    cy.get("#itc-description").clear().type(" ");

    cy.get('[data-cy="itc-btn"]').click();
  });
});
