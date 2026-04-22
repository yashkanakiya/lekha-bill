describe("Item Index", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Customer Create Flow", () => {
    cy.visit("/create-customer");

    cy.intercept("POST", "/api/customers").as("create-customer");
    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");

    cy.get('[data-cy="ctc-title"]').contains("Create Customer");

    // breadcrumb
    cy.get(".ctc-bc-parent").click();
    cy.url().should("eq", "http://localhost:5173/customers");
    cy.visit("/create-customer");
    cy.get(".ctc-bc-child").contains("Create Customer");

    // form
    cy.get("#ctc-name-title").contains("Customer Name");
    cy.get('[data-cy="ctc-name"]').type("John Doe");

    cy.get("#ctc-email-title").contains("Email");
    cy.get('[data-cy="ctc-email"]').type("jd@gmail.com");

    cy.get("#ctc-phone-title").contains("Phone");
    cy.get('[data-cy="ctc-phone"]').type("8458586732");

    cy.get("#ctc-address-title").contains("Address");
    cy.get('[data-cy="ctc-address"]').type(
      "20, st.peter street, navi mumbai, maharastra.",
    );

    cy.get('[data-cy="ctc-submit"]').click();
    cy.contains("Customer Created Successfully");
    cy.wait("@create-customer");
    cy.url().should("eq", "http://localhost:5173/customers");
  });

  it("Customer Create with existing email Flow", () => {
    cy.visit("/create-customer");
    cy.intercept("POST", "/api/customers").as("create-customer");

    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");

    cy.get('[data-cy="ctc-title"]').contains("Create Customer");

    // form
    cy.get("#ctc-name-title").contains("Customer Name");
    cy.get('[data-cy="ctc-name"]').type("Alex Carry");

    cy.get("#ctc-email-title").contains("Email");
    cy.get('[data-cy="ctc-email"]').type("jd@gmail.com");

    cy.get("#ctc-phone-title").contains("Phone");
    cy.get('[data-cy="ctc-phone"]').type("3425234545445");

    cy.get("#ctc-address-title").contains("Address");
    cy.get('[data-cy="ctc-address"]').type(
      "20, st.peter street, navi mumbai, maharastra.",
    );

    cy.get('[data-cy="ctc-submit"]').click();
    cy.contains("The email has already been taken.");
    cy.wait("@create-customer");
    cy.url().should("eq", "http://localhost:5173/create-customer");
  });


  it("Customer Create with blank data", () => {
    cy.visit("/create-customer");

    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");

    cy.get('[data-cy="ctc-title"]').contains("Create Customer");

    // form
    cy.get("#ctc-name-title").contains("Customer Name");
    cy.get('[data-cy="ctc-name"]').type(" ");

    cy.get("#ctc-email-title").contains("Email");
    cy.get('[data-cy="ctc-email"]').type(" ");

    cy.get("#ctc-phone-title").contains("Phone");
    cy.get('[data-cy="ctc-phone"]').type(" ");
    cy.get('[data-cy="ctc-phone"]').type("asdasd");

    cy.get("#ctc-address-title").contains("Address");
    cy.get('[data-cy="ctc-address"]').type(
      " ",
    );

    cy.get('[data-cy="ctc-submit"]').click();
    cy.url().should("eq", "http://localhost:5173/create-customer");
  });
});
