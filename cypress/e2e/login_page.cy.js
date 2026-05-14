describe("Login Page", () => {
  onBeforeEach(() => {
    cy.visit("/login");
  });

  it("Login Success Flow", () => {
    cy.get("#logo")
      .should("be.visible")
      .and(($logo) => {
        expect($logo[0].naturalWidth).to.be.greaterThan(0);
      });

    cy.contains("Log in to your account");

    // intercept API
    cy.intercept("GET", "/sanctum/csrf-cookie").as("csrf");
    cy.intercept("POST", "/api/login").as("login");
    cy.intercept("GET", "/api/user").as("user");

    cy.get("#login-email").type("admin@vensura.co");
    cy.get("#login-password").type("vensura@123");

    cy.get("#login-click").click();

    // wait for requests
    cy.wait("@csrf");
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    // cy.wait("@user").its("response.statusCode").should("eq", 200);

    // assert redirect
    cy.url().should("include", "/");
    cy.contains("Login Successfully");
  });

  it("Redirect from Login to Register and visa versa", () => {
    cy.contains("New? click on Register!").click();

    cy.contains("Register your account");

    cy.contains("Back to Login").click();

    cy.url().should("eq", "http://localhost:5173/login");
  });

  it("Login Credential Failed / Negative Flow", () => {
    // intercept API
    cy.intercept("GET", "/sanctum/csrf-cookie").as("csrf");
    cy.intercept("POST", "/api/login").as("login");

    cy.get("#login-email").type("admin@vensura1.co");
    cy.get("#login-password").type("vensura@1231");

    cy.get("#login-click").click();

    // wait for requests
    cy.wait("@csrf");
    cy.wait("@login").its("response.statusCode").should("eq", 401);

    cy.contains("Invalid credentials");
  });

  it("Login Credential Empty Data / Negative Flow", () => {
    cy.get("#login-email").type(" ");
    cy.get("#login-password").type(" ");

    cy.get("#login-click").click();

    // cy.contains("Invalid credentials");
  });

  it("Login Credential Edge Testing", () => {
    cy.get("#login-email").type(
      "admin@vensura1asdsaadadsdada@sdsdasdadasdasdadsadadadsadda.co",
    );
    cy.get("#login-password").type("+_}C{#322322wssddssssdsda@1231");

    cy.get("#login-click").click();

    cy.contains(" Invalid email format");
  });
});
