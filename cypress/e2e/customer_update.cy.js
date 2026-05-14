describe("Customer Update Testing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/edit-customer/9");
  });

  it("Possitive Update Form", () => {
    cy.intercept("GET", "api/customers/9").as("getCustomer");

    cy.wait("@getCustomer");

    cy.get('[data-cy="ctc-title"]').should("have.text", "Edit Customer");

    cy.get(".ctc-bc-parent").click();
    cy.get("h1").should("have.text", "Customer List");
    cy.visit("/edit-customer/9");
    cy.get(".ctc-bc-child").should("have.text", "Edit Customer");

    //form
    cy.get("#ctc-name-title").should("have.text", "Customer Name");
    cy.get('[data-cy="ctc-name"]').wait(200).clear().type("Rusty Vane");
    cy.get("#ctc-email-title").should("have.text", "Email");
    cy.get('[data-cy="ctc-email"]').clear().type("rustyvane@gmail.com");
    cy.get("#ctc-phone-title").should("have.text", "Phone");
    cy.get('[data-cy="ctc-phone"]').clear().type("5463728190");
    cy.get("#ctc-address-title").should("have.text", "Address");
    cy.get('[data-cy="ctc-address"]').clear().type("202, nirmanflat,bortalav");

    cy.get('button[type="submit"]').click();
    cy.intercept("GET", "api/customers").as("getCustomerList");
    cy.url().should("eq", "http://localhost:5173/customers");
    cy.wait("@getCustomerList");
  });

  it("Negative Update Form", () => {
    cy.intercept("GET", "api/customers/9").as("getCustomer");

    cy.wait("@getCustomer");

    cy.get('[data-cy="ctc-title"]').should("have.text", "Edit Customer");

    cy.get(".ctc-bc-parent").click();
    cy.get("h1").should("have.text", "Customer List");
    cy.visit("/edit-customer/9");
    cy.get(".ctc-bc-child").should("have.text", "Edit Customer");

    //form
    // cy.get("#ctc-name-title").should("have.text", "Customer Name");
    // cy.get('[data-cy="ctc-name"]').wait(200).clear().type("Rusty Vane");
    cy.get("#ctc-email-title").should("have.text", "Email");
    cy.get('[data-cy="ctc-email"]').wait(200).clear().type("rustyvanegmailcom");
    cy.get("#ctc-phone-title").should("have.text", "Phone");
    cy.get('[data-cy="ctc-phone"]').clear().type("adadadsdadsda343434");
    // cy.get("#ctc-address-title").should("have.text", "Address");
    // cy.get('[data-cy="ctc-address"]').clear().type("202, nirmanflat,bortalav");

    cy.get('button[type="submit"]').click();
    cy.get();
    cy.url().should("eq", "http://localhost:5173/edit-customer/9");
  });
});
