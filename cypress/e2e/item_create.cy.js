describe("Item Create", () => {
  beforeEach(() => {
    cy.login();
  });
  it("Item Create Flow", () => {
    cy.visit("/create-item");

    cy.get("#itc-name").type("Item one")
    cy.get("#itc-price").type(5000)
    cy.get("#itc-description").type("This is Item one")

    cy.contains("Submit").click()
    cy.intercept("POST", "/api/items").as("Create-Item")
    cy.wait("@Create-Item")

    cy.url().should("eq", "http://localhost:5173/items");
  });

  it("Item Create with Blank data", () => {
    cy.visit("/create-item");

    cy.get("#itc-name").type(" ");
    cy.get("#itc-price").type(-1);
    cy.get("#itc-description").type(" ");

    cy.contains("Submit").click();;
  });

});
