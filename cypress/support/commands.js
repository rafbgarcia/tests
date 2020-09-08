/**
 * @example cy.loginAs("twenhold")
 */
Cypress.Commands.add("loginAs", (login) => {
  cy.visit("/login")
  cy.get("#email").type(login)
  cy.get("#password").type("improvement")
  cy.contains("Sign In").click()
})

Cypress.Commands.add("isLoggedIn", () => (
  cy.getCookie("_nitro_session")
))
