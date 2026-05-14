describe("Item Update", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/edit-item/10");
  });
  it("Item Update Flow | Possitive Test", () => {
    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");
    cy.intercept("GET", "/api/items/10").as("Get-Item");
    cy.wait("@Get-Item");
    cy.intercept("PUT", "/api/items/10").as("Update-Item");

    cy.get('[data-cy="itc-title"]').contains("Edit Item");

    // breadcrumb
    cy.get(".itc-bc-parent").click();
    cy.url().should("eq", "http://localhost:5173/items");
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

  it("Item Update Flow | Negative Test", () => {
    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");
    cy.intercept("GET", "/api/items/10").as("Get-Item");
    cy.wait("@Get-Item");
    cy.intercept("PUT", "/api/items/10").as("Update-Item");

    cy.get('[data-cy="itc-title"]').contains("Edit Item");

    // form
    cy.get("#itc-name-title").contains("Item Name");
    cy.get('[data-cy="itc-name"]').clear().type(12313123131331);
    cy.get("#itc-price-title").contains("Price");
    cy.get('[data-cy="itc-price"]').clear().type(-1);
    cy.get("#itc-description-title").contains("Description");
    cy.get('[data-cy="itc-description"]')
      .clear()
      .type(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id diam vehicula, imperdiet lacus eget, accumsan quam. Nullam condimentum metus malesuada lorem bibendum, at tincidunt erat lobortis. Nulla nec tempor turpis. Mauris semper ultrices tortor, at aliquam odio volutpat in. Cras et nisl eu ex aliquet mollis. Sed vitae efficitur nunc. Etiam eu cursus nisi. Duis libero enim, scelerisque et viverra eget, molestie ut neque. Maecenas a metus turpis. Cras sed suscipit sem. Nulla euismod eu diam eget placerat. Nam egestas vulputate ipsum, ut aliquam nulla ultricies ut. Ut lacus magna, hendrerit eu finibus accumsan, sagittis sit amet leo. Praesent egestas sit amet nibh non luctus. Pellentesque sodales volutpat tellus in posuere. Aenean venenatis luctus magna, vel viverra lectus pharetra quis.Proin fringilla tincidunt mauris, eget maximus nisi porta id. Mauris ex eros, ultrices ac mollis id, commodo eget quam. Fusce blandit rhoncus commodo. Etiam sit amet nisl arcu. Mauris finibus, magna et blandit venenatis, velit urna mattis dolor, ut vehicula ex quam a lacus. Cras quis commodo magna. Mauris a elit dolor. Duis hendrerit, justo ac pulvinar faucibus, metus nunc aliquam elit, in egestas nisl tortor et tortor. Nulla augue dolor, eleifend a odio in, accumsan ultrices sem. Integer pretium enim et porttitor pulvinar. Sed non eleifend justo.Etiam nunc ex, rutrum dictum lacinia eu, auctor id nibh. Suspendisse et dictum ex, in tristique metus. Duis vitae pharetra enim. Cras vehicula lacus et nunc venenatis, aliquam pharetra enim consectetur. Donec efficitur lacus elit, sit amet pellentesque ligula fermentum eget. Aenean non arcu enim. Sed convallis.",
      );

    cy.get('[data-cy="itc-submit"]').click();
  });

  it("Item Update with Blank data", () => {
    cy.intercept("GET", "/api/items/10").as("Get-Item");
    cy.wait("@Get-Item");

    // form
    cy.get("#itc-name-title").contains("Item Name");
    cy.get('[data-cy="itc-name"]').clear().type(" ");
    cy.get("#itc-price-title").contains("Price");
    cy.get('[data-cy="itc-price"]').clear().type(" ");
    cy.get("#itc-description-title").contains("Description");
    cy.get('[data-cy="itc-description"]').clear().type(" ");

    cy.get('[data-cy="itc-submit"]').click();
  });
});
