const USER = 'teemu.testaaja@test.net'
const CURRENT_PWD = 'ThisIsMyPwd_2019'
const DEFAULT_TITLE = 'An interesting story about the Finnish football'
const DEFAULT_CONTENT =
  'https://dynamic.hs.fi/2019/karsintakuvat/?_ga=2.73417106.1043337552.1573848580-425762508.1569652028'
const DEFAULT_KEYWORDS = 'football'

describe('Memory Tracks with a logged in user', function() {
  it('a logged in user wants to delete an existing note, but clicks cancel on the confirmation modal element', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.wait(5000)
    cy.contains(DEFAULT_TITLE)
    cy.contains(DEFAULT_CONTENT)
    cy.contains(DEFAULT_KEYWORDS)
    cy.get('[data-cy=deleteSubmit]').click()
    cy.contains('Are you certain that you want to delete the note?')
    cy.get('[data-cy=cancelConfirmation').click()
    cy.wait(1000)
    cy.contains(DEFAULT_TITLE)
    cy.contains(DEFAULT_CONTENT)
    cy.contains(DEFAULT_KEYWORDS)
  })
  it('a logged in user is able to delete an existing note', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.wait(5000)
    cy.contains(DEFAULT_TITLE)
    cy.contains(DEFAULT_CONTENT)
    cy.contains(DEFAULT_KEYWORDS)
    cy.get('[data-cy=deleteSubmit]').click()
    cy.contains('Are you certain that you want to delete the note?')
    cy.get('[data-cy=submitConfirmation').click()
    cy.wait(1000)
    cy.contains('Stored Notes')
    cy.contains('No stored notes found.')
  })
  it('a logged in user is able to add a new note', function() {
    const noteTitle = 'This is a fancy test note'
    const noteContent =
      'We can type in a bit more text and it should be shown on the card component.'
    const noteKeywords = 'KeyWord1,      ANOTHer Keyword'
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.wait(2000)
    cy.get('#add_note_button').click()
    cy.get('#title_field').type(noteTitle)
    cy.get('#content_field').type(noteContent)
    cy.get('#keywords_field').type(noteKeywords)
    cy.get('#save_note_button').click()
    cy.wait(2000)
    cy.contains('This is a fancy test note')
    cy.contains('keyword1')
    cy.contains('another keyword')
  })
})

// TODO:
// - Reset/Init DB after each round (no dependent tests)
// - Test validation
// - Negative cases as well
