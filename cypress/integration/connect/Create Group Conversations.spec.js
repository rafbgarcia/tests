/// <reference types="cypress" />
// @ts-check

it("Create Group Conversation", () => {
  cy.server()
  cy.route("GET", "**/state.json*").as("state")

  cy.visit("https://nitroqa.mydatainmotion.com/connect")
  cy.url().should("include", "login")
  cy.get("[id=email]").type("kschwerin")
  cy.get("[id=password]").type("LibertyBell")
  cy.contains("Sign In").click()
  cy.url().should("include", "connect")

  cy.get(".btn-add").click()
  cy.get("[placeholder='Find or start a conversation']").type("Ben Klang", { delay: 50 })
  cy.get(".bookmark-selector-list-container .people-bookmark:first").contains("Ben Klang").click()
  cy.get("[placeholder='Find or start a conversation']").clear().type("Jenny Gray", { delay: 100 })
  cy.get(".bookmark-selector-list-container .people-bookmark:first").contains("Jenny Gray").click()
  cy.contains("Start").click()
  cy.contains("Ben, Jenny, & Kraig").should("exist")
})
