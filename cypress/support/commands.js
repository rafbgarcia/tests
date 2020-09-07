/**
 * @example cy.loginAs("twenhold")
 */
Cypress.Commands.add("loginAs", (login) => {
  cy.url().should("include", "login")
  cy.get("#email").type(login)
  cy.get("#password").type("improvement")
  cy.contains("Sign In").click()
})
