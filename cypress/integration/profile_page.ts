describe("Profile Page", () => {
  beforeEach(() => {
    cy
      .request("POST", "/api/login", {
        username: "Michael.Tugby@test.com",
        password: "test123"
      })
      .then(res => {
        cy.setCookie("token", res.body.token);
      });
    cy.visit("/profile");
  });

  it("should redirect to login with no token", () => {
    cy.clearCookie("token");
    cy.reload();
    cy.location().should(location => {
      expect(location.pathname).to.equal("/login");
      expect(location.search).to.equal("?redirect=%2Fprofile");
    });
  });

  it("should redirect to login with invalid token", () => {
    cy.setCookie("token", "test123");
    cy.reload();
    cy.location().should(location => {
      expect(location.pathname).to.equal("/login");
      expect(location.search).to.equal("?redirect=%2Fprofile");
    });
  });

  it("should allow access to page with valid token", () => {
    cy.location().should(location => {
      expect(location.pathname).to.equal("/profile");
    });
  });

  it("biography should be a textarea", () => {
    cy.get("textarea#UserProfileBiography").should("be.visible");
  });

  it("biography should allow a user to enter text", () => {
    cy.get("#UserProfileBiography").clear();
    cy.get("#UserProfileBiography").type("Test Biography.");
    cy.get("#UserProfileBiography").should("have.value", "Test Biography.");
  });

  it("biography should clear on click", () => {
    cy.contains("clear").click();
    cy.get("#UserProfileBiography").should("not.have.value");
  });

  it("biography should display an error message on blank biography", () => {
    cy.get("#UserProfileBiography").clear();
    cy.contains("The biography field is required.").should("be.visible");
  });

  it("biography counter works", () => {
    cy.get("#UserProfileBiography").clear();
    cy.contains("0 / 100").should("be.visible");
    cy.get("#UserProfileBiography").type("Test");
    cy.contains("4 / 100").should("be.visible");
  });

  it("biography should display an error message with a string greater than 100", () => {
    cy.get("#UserProfileBiography").clear();
    cy.get("#UserProfileBiography").type(`Very long string. Very long string.
        Very long string. Very long string. Very long string. Very long string.
        Very long string. Very long string. Very long string. Very long string.`);
    cy
      .contains("The biography field may not be greater than 100 characters.")
      .should("be.visible");
  });

  it("save button with invalid bio does nothing", () => {
    cy.get("#UserProfileBiography").clear();
    cy.get("#UserProfileSaveButton").click();
    cy.contains("Successfully updated bio.").should("not.be.visible");
  });

  it("save button with valid bio saves bio", () => {
    cy.get("#UserProfileBiography").clear();
    cy
      .get("#UserProfileBiography")
      .type("This is a test biography from Cypress!");
    cy.get("#UserProfileSaveButton").click();
    cy.contains("Successfully updated bio.").should("be.visible");
  });

  it("save button with valid bio updates bio", () => {
    cy
      .get("#UserProfileBiography")
      .should("have.value", "This is a test biography from Cypress!");
    cy.get("#UserProfileBiography").clear();
    cy
      .get("#UserProfileBiography")
      .type("This is another test biography from Cypress!");
    cy.get("#UserProfileSaveButton").click();
    cy.contains("Successfully updated bio.").should("be.visible");
    cy.reload();
    cy
      .get("#UserProfileBiography")
      .should("have.value", "This is another test biography from Cypress!");
  });

  it("displays correct profile data from server", () => {
    cy
      .getCookie("token")
      .then(cookie => {
        return cy.request({
          method: "GET",
          url: "/api/profile",
          headers: {
            Authorization: `Bearer ${cookie ? cookie.value : ""}`
          }
        });
      })
      .then(res => {
        const profile = res.body.profile;
        cy.get("#UserProfileFullName").should("have.text", profile.FullName);
        cy.get("#UserProfileJobTitle").should("have.text", profile.JobTitle);
        cy
          .get("#UserProfileEmailAddress")
          .should("have.text", profile.EmailAddress);
        cy.get("#UserProfileDirector").should("have.text", profile.Director);
        cy
          .get("#UserProfileFirstLineReporting")
          .should("have.text", profile.FirstLineReporting);
        cy
          .get("#UserProfileSecondLineReporting")
          .should("have.text", profile.SecondLineReporting);
      });
  });
});
