describe("Register Page", () => {
    it("Register Success Flow", () => {
      cy.visit("/login");

      cy.contains("New? click on Register!").click();

      cy.contains("Register your account");

      cy.intercept("GET", "/sanctum/csrf-cookie").as("csrf");
        // cy.intercept("GET", "/api/user").as("user");
      cy.intercept("POST", "/api/register").as("register");

      cy.get("#rg-name").type("Harsh");
      cy.get("#rg-email").type("harsh@gmail.com");
      cy.get("#rg-password").type("admin@123");
      cy.get("#rg-confirmPassword").type("admin@123");

      cy.get("#rg-submit").click();
    //   cy.wait(5000)

      cy.wait("@csrf");
    //   cy.wait("@user").its("response.statusCode").should("eq", 201);
      cy.wait("@register").its("response.statusCode").should("eq", 201);


      cy.contains("Invitation link sent successfully");
      cy.url().should("eq", "http://localhost:5173/login");

    });

     it("Register Failed Flow", () => {
       cy.visit("/login");

       cy.contains("New? click on Register!").click();

       cy.contains("Register your account");
       
       cy.intercept("GET", "/sanctum/csrf-cookie").as("csrf");
    //    cy.intercept("GET", "/api/user").as("user");
       cy.intercept("POST", "/api/register").as("register");

       cy.get("#rg-name").type("Harsh");
       cy.get("#rg-email").type("harsh@gmail.com");
       cy.get("#rg-password").type("admin@123");
       cy.get("#rg-confirmPassword").type("admin@123");

       cy.get("#rg-submit").click();
    //    cy.wait(5000);

       cy.wait("@csrf");
    //    cy.wait("@user").its("response.statusCode").should("eq", 201);
       cy.wait("@register").its("response.statusCode").should("eq", 422);
       cy.contains("The email has already been taken.");

     });
})