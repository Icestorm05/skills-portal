describe("Skills Page", () => {
  beforeEach(() => {
    cy
      .request("POST", "/api/login", {
        username: "Michael.Tugby@test.com",
        password: "test123"
      })
      .then(res => {
        cy.setCookie("token", res.body.token);
      });
    cy.visit("/skills");
  });

  it("should redirect to login with no token", () => {
    cy.clearCookie("token");
    cy.reload();
    cy.location().should(location => {
      expect(location.pathname).to.equal("/login");
      expect(location.search).to.equal("?redirect=%2Fskills");
    });
  });

  it("should redirect to login with invalid token", () => {
    cy.setCookie("token", "test123");
    cy.reload();
    cy.location().should(location => {
      expect(location.pathname).to.equal("/login");
      expect(location.search).to.equal("?redirect=%2Fskills");
    });
  });

  it("should allow access to page with valid token", () => {
    cy.location().should(location => {
      expect(location.pathname).to.equal("/skills");
    });
  });
});
