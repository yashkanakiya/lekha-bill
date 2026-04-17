describe("Item Index", () => {
  beforeEach(() => {
    cy.login();
  });
  it("Item Index Flow", () => {
    cy.visit("/items");

    cy.intercept("GET", "/api/items").as("List-Item");
    cy.wait("@List-Item");

    cy.get('[data-cy="itl-title"]');
    cy.contains("Create Item");

    cy.get('[data-cy="action-1"]').click();
    cy.get(".menu-edit").click();
    cy.url().should("eq", "http://localhost:5173/edit-item/1");
    cy.get(".it-bc-child").should("have.text", "Edit item");
    cy.get(".it-bc-parent").click();

    cy.get('[data-cy="action-1"]').click();
    cy.get(".menu-delete").click();
    cy.contains("Are you sure you want to delete this item?");
    cy.contains("Cancel").click();

    cy.get('[data-cy="action-1"]').click();
    cy.get(".menu-delete").click();
    cy.contains("Are you sure you want to delete this item?");
    cy.get('[data-cy="cnf-del"]').click();
    cy.intercept("DELETE", "/api/items/1").as("Delete-Item");
    cy.wait("@Delete-Item");
  });

  it("should show 10 rows by default", () => {
    cy.visit("/items");
    cy.get('[data-cy="it-table"] tbody tr').should("have.length", 10);
  });

  it("should change rows per page to 20", () => {
    cy.visit("/items");
    // open dropdown
    cy.get(".p-select-dropdown").click();

    // select 20
    cy.get(".p-select-option").contains("20").click();

    // verify rows count
    cy.get('[data-cy="it-table"] tbody tr').should("have.length", 20);
  });

  it("should go to next page", () => {
    cy.visit("/items");
    // capture first row text before
    cy.get('[data-cy="it-table"] tbody tr:first')
      .invoke("text")
      .then((firstRowBefore) => {
        // click next page
        cy.get(".p-paginator-next").click();

        // verify content changed
        cy.get('[data-cy="it-table"] tbody tr:first')
          .invoke("text")
          .should((firstRowAfter) => {
            expect(firstRowAfter).not.to.eq(firstRowBefore);
          });
      });
  });

  it("should go back to previous page", () => {
    cy.visit("/items");
    cy.get(".p-paginator-next").click();
    cy.get(".p-paginator-prev").click();

    // cy.get(".p-paginator-prev").should("not.be.disabled");
  });
});
