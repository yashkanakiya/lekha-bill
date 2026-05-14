describe("Item Create", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/create-item");
  });
  it("Item Create Flow", () => {
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

  it("Item Create Flow | Negative Test", () => {
    cy.intercept("POST", "/api/items").as("Create-Item");
    cy.intercept("GET", "/api/user").as("user");
    cy.wait("@user");

    cy.get('[data-cy="itc-title"]').contains("Create Item");

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

  it("Item Create with Blank data", () => {
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
