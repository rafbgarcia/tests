describe("Connect Smoke Test", () => {
  const bookmarksSection = ".bookmark-list"
  const peopleBookmarksSection = ".bookmarks-people"
  const peopleBookmarkItem = ".people-bookmark"
  const newConversationBtn = ".btn-add"
  const closeBookmarkBtn = ".btn-close"
  const searchResults = ".filterable-list"
  const searchConversationField = "[placeholder='Find or start a conversation']"

  before(() => {
    cy.server()
    cy.route("GET", "**/state.json*").as("state")

    cy.visit("/connect")
    cy.loginAs("rafael.garcia")

    cy.url().should("include", "connect")
    cy.wait("@state")
  })

  it("Create Group Conversation", () => {
    const groupConvoName = "Carlos, Gabriel, & Rafael"

    // Make sure the bookmark we're creating is not present
    cy.get(peopleBookmarksSection).scrollIntoView()
    cy.get(peopleBookmarksSection).then($bookmarks => {
      if ($bookmarks.text().includes(groupConvoName)) {
        cy.contains(peopleBookmarkItem, groupConvoName).find(closeBookmarkBtn).click({ force: true })
      }
    })
    cy.contains(peopleBookmarkItem, groupConvoName).should("not.exist")

    // Create new group convo
    cy.get(newConversationBtn).click()
    cy.get(searchConversationField).type("Carlos Palhares")
    cy.get(searchResults).contains("Carlos Palhares").click()
    cy.get(searchConversationField).clear().type("Gabriel Pereira")
    cy.get(searchResults).contains("Gabriel Pereira").click()
    cy.contains("Start").click()
    cy.contains(peopleBookmarkItem, groupConvoName).should("exist")
  })
})
