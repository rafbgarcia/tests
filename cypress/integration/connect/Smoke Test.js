Cypress.Cookies.defaults({
  preserve: ["_nitro_session", "APP"]
})

describe("Connect Smoke Test", () => {
  // Left side bar
  const peopleBookmarksSection = ".bookmarks-people"
  const peopleBookmarkItem = ".people-bookmark"
  const newConversationBtn = ".btn-add"
  const closeBookmarkBtn = ".btn-close"

  // New Conversation Modal
  const searchResults = ".filterable-list"
  const searchConversationField = "[placeholder='Find or start a conversation']"

  // Messages
  const message = ".message"
  const messageField = ".public-DraftEditor-content"
  const reactions = ".emoji-all-reactions"
  const favoriteReactions = ".emoji-favorites"

  before(() => {
    cy.route2("**/state.json*").as("state")
    cy.isLoggedIn().then(isLoggedIn => {
      if (!isLoggedIn) {
        cy.loginAs("rafael.garcia")
      }
    })
    cy.visit("/connect")
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

  it("Send Message to Group Conversation", () => {
    cy.route2({ method: "POST", url: "**/messages" }).as("sendMessage")
    cy.get(messageField).type("Hoy team 😸{enter}")
    cy.wait("@sendMessage")
    cy.contains(message, "Hoy team 😸")
  })

  it("React on Group Conversation", () => {
    cy.route2("**/reactions*").as("reactions")
    cy.get(message).last().find(favoriteReactions).contains("👍").click({ force: true })
    cy.get(message).last().find(favoriteReactions).contains("❤️").click({ force: true })
    cy.wait("@reactions")

    cy.get(message).last().find(reactions).contains("👍")
    cy.get(message).last().find(reactions).contains("❤️")
  })

  it("Send Message to One-on-One", () => {
    cy.route2("**/messages.json*").as("fetchMessages")
    cy.route2({ method: "POST", url: "**/messages" }).as("sendMessage")

    cy.get(newConversationBtn).click()
    cy.get(searchConversationField).type("Diego Borges")
    cy.get(searchResults).contains("Diego Borges").click()
    cy.contains("Start").click()
    cy.wait("@fetchMessages")
    cy.wait(200)

    cy.get(".public-DraftEditor-content").type("Hoy Diego 😸{enter}")
    cy.wait("@sendMessage")
    cy.contains(message, "Hoy Diego 😸")
  })

  it("React on One-on-One Conversation", () => {
    cy.route2("**/reactions*").as("reactions")
    cy.get(message).last().find(favoriteReactions).contains("😂").click({ force: true })
    cy.get(message).last().find(favoriteReactions).contains("😊").click({ force: true })
    cy.wait("@reactions")

    cy.get(message).last().find(reactions).contains("😂")
    cy.get(message).last().find(reactions).contains("😊")
  })
})
