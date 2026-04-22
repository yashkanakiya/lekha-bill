describe("Item Create", () => {
  beforeEach(() => {
    cy.login();
  });
  it("Item Create Flow", () => {
    cy.visit("/create-item");

    cy.intercept("POST", "/api/items").as("Create-Item");
    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");

    cy.get('[data-cy="itc-title"]');
    cy.contains("Create Item");

    // breadcrumb
    cy.get(".itc-bc-parent").click();
    cy.url().should("eq", "http://localhost:5173/items");
    cy.visit("/create-item");
    cy.get(".itc-bc-child").contains("Create item");

    // form
    cy.get("#itc-name-title").contains("Item Name");
    cy.get('[data-cy="itc-name"]').type("Item one");
    cy.get("#itc-price-title").contains("Price");
    cy.get('[data-cy="itc-price"]').type(5000);
    cy.get("#itc-description-title").contains("Description");
    cy.get('[data-cy="itc-description"]').type("This is Item one");

    cy.get('[data-cy="itc-submit"]').click();
    cy.contains("Item Created Successfully");
    cy.wait("@Create-Item");

    cy.url().should("eq", "http://localhost:5173/items");
  });

  it("Item Create with Blank data", () => {
    cy.visit("/create-item");

    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");

    cy.get('[data-cy="itc-title"]').contains("Create Item");

    // form
    cy.get("#itc-name-title").contains("Item Name");
    cy.get('[data-cy="itc-name"]').type(" ");
    cy.get("#itc-price-title").contains("Price");
    cy.get('[data-cy="itc-price"]').type(-1);
    cy.get("#itc-description-title").contains("Description");
    cy.get('[data-cy="itc-description"]').type(" ");

    cy.get('[data-cy="itc-submit"]').click();
  });
});
