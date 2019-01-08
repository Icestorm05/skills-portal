describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("brings up validation errors on blank email and password", () => {
    cy.contains("The email field is required.").should("not.be.visible");
    cy.contains("The password field is required.").should("not.be.visible");
    cy.get("#LoginSubmitButton").click();
    cy.contains("The email field is required.").should("be.visible");
    cy.contains("The password field is required.").should("be.visible");
  });

  it("brings up an email validation error when blurring on focused blank email", () => {
    cy.get("#LoginEmail").focus();
    cy.contains("The email field is required.").should("not.be.visible");
    cy.get("#LoginEmail").blur();
    cy.contains("The email field is required.").should("be.visible");
  });

  it("brings up a password validation error when blurring on focused blank password", () => {
    cy.get("#LoginPassword").focus();
    cy.contains("The password field is required.").should("not.be.visible");
    cy.get("#LoginPassword").blur();
    cy.contains("The password field is required.").should("be.visible");
  });

  it("hides email validation error when entering text into email field", () => {
    cy.get("#LoginSubmitButton").click();
    cy.contains("The email field is required.").should("be.visible");
    cy.get("#LoginEmail").type("test@test.com");
    cy.contains("The email field is required.").should("not.be.visible");
  });

  it("hides password validation error when entering text into password field", () => {
    cy.get("#LoginSubmitButton").click();
    cy.contains("The password field is required.").should("be.visible");
    cy.get("#LoginPassword").type("test");
    cy.contains("The password field is required.").should("not.be.visible");
  });

  it("displays snackbar error message with invalid email and/or password", () => {
    cy.get("#LoginEmail").type("test@test.com");
    cy.get("#LoginPassword").type("test");
    cy.get("#LoginSubmitButton").click();
    cy.get("#TheSnackbar").should("be.visible");
    cy
      .get("#TheSnackbar")
      .contains("Incorrect email address and/or password.")
      .should("be.visible");
    cy
      .get("#TheSnackbar")
      .children()
      .should("have.class", "error");
  });

  it("redirects to profile page with valid email and password", () => {
    cy.get("#LoginEmail").type("Michael.Tugby@test.com");
    cy.get("#LoginPassword").type("test123");
    cy.get("#LoginSubmitButton").click();
    cy.location().should(location => {
      expect(location.pathname).to.equal("/profile");
    });
  });

  it("redirects to redirect query with valid email and password", () => {
    cy.visit("/login?redirect=skills");
    cy.get("#LoginEmail").type("Michael.Tugby@test.com");
    cy.get("#LoginPassword").type("test123");
    cy.get("#LoginSubmitButton").click();
    cy.location().should(location => {
      expect(location.pathname).to.equal("/skills");
    });
  });
});
