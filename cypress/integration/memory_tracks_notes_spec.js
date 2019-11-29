const utils = require('./utils')
const USER = 'teemu.testaaja@test.net'
const CURRENT_PWD = 'ThisIsMyPwd_2019'
const DEFAULT_TITLE = 'An interesting story about the Finnish football'
const DEFAULT_CONTENT =
  'https://dynamic.hs.fi/2019/karsintakuvat/?_ga=2.73417106.1043337552.1573848580-425762508.1569652028'
const DEFAULT_KEYWORDS = 'football'
const ANOTHER_NOTE_TITLE = 'This is a fancy test note'
const ANOTHER_NOTE_CONTENT =
  'We can type in a bit more text and it should be shown on the card component. '
const ANOTHER_NOTE_KEYWORDS = 'KeyWord1,      ANOTHer Keyword'
const THIRD_NOTE_TITLE = 'A reminder from 28.11.2019'
const THIRD_NOTE_CONTENT = 'Buy milk at the store'
const THIRD_NOTE_KEYWORDS = 'shopping'

describe('Manipulating notes with a logged in user', function() {
  this.beforeAll(function() {
    cy.log('Running the re-initialization of the test db')
    utils.initDb()
  })

  beforeEach(function() {
    cy.log('Executing login before each test!')
    cy.visit('http://localhost:3000')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.get('#menu_notes_button').click()
  })

  it('a logged in user wants to delete an existing note, but clicks cancel on the confirmation modal element', function() {
    cy.contains(DEFAULT_TITLE)
    cy.contains(DEFAULT_CONTENT)
    cy.contains(DEFAULT_KEYWORDS)
    cy.get('[data-cy=deleteSubmit]').click()
    cy.contains('Are you certain that you want to delete the note?')
    cy.get('[data-cy=cancelConfirmation').click()
    cy.contains(DEFAULT_TITLE)
    cy.contains(DEFAULT_CONTENT)
    cy.contains(DEFAULT_KEYWORDS)
  })

  it('a logged in user is able to delete an existing note', function() {
    cy.contains(DEFAULT_TITLE)
    cy.contains(DEFAULT_CONTENT)
    cy.contains(DEFAULT_KEYWORDS)
    cy.get('[data-cy=deleteSubmit]').click()
    cy.contains('Are you certain that you want to delete the note?')
    cy.get('[data-cy=submitConfirmation').click()
    cy.contains('No stored notes found.')
  })

  it('a logged in user is able to add a new note', function() {
    cy.get('#add_note_button').click()
    cy.get('#title_field').type(ANOTHER_NOTE_TITLE)
    cy.get('#content_field').type(ANOTHER_NOTE_CONTENT)
    cy.get('#keywords_field').type(ANOTHER_NOTE_KEYWORDS)
    cy.get('#save_note_button').click()
    cy.contains('This is a fancy test note')
    cy.contains('keyword1')
    cy.contains('another keyword')
  })

  it('a logged in user is able to change an existing note, and its attributes are changed accordingly and the timestamp is updated', function() {
    cy.log(
      'Changing an existing note and checking that the attribute changes are updated. We do that by editing the note created in the previous step'
    )
    cy.contains(ANOTHER_NOTE_TITLE)
    cy.contains(ANOTHER_NOTE_CONTENT)
    cy.contains('keyword1')
    cy.contains('Last modified')

    cy.get('[data-cy=timestampField').then($tsField => {
      console.log($tsField)
    })
    // Get the last modified data so it can be later compared after editing the note
    cy.get('[data-cy=editSubmit]').click()
    cy.get('#title_field').type(' Hey this was updated!')
    cy.get('#content_field').type(' Note this was changed too!')
    cy.get('#save_note_button').click()
    cy.contains('This is a fancy test note Hey this was updated!')
    cy.contains('Note this was changed too!')
    cy.contains('keyword1')
    cy.contains('another keyword')
    cy.contains('Last modified:')
  })

  it('no note is shown on the page, if the content is filtered by using a non-existent keyword', function() {
    cy.log(
      'Adding an additional note to enable better chances for the filtering'
    )
    cy.get('#menu_notes_button').click()
    cy.get('#add_note_button').click()
    cy.wait(2000)
    cy.get('#title_field').type(THIRD_NOTE_TITLE)
    cy.wait(500)
    cy.get('#content_field').type(THIRD_NOTE_CONTENT)
    cy.wait(500)
    cy.get('#keywords_field').type(THIRD_NOTE_KEYWORDS)
    cy.wait(500)
    cy.get('#save_note_button').click()
    cy.wait(2000)
    cy.contains(THIRD_NOTE_TITLE)
    // Type in a search term that is not available in the existing notes
    cy.get('#search_field').type('shpp')
    cy.wait(1000)
    cy.contains('No stored notes found')
  })

  it('one note is shown on the screen, when filtering by a keyword used in one note', function() {
    cy.contains(THIRD_NOTE_TITLE)
    cy.contains(THIRD_NOTE_CONTENT)
    cy.contains(THIRD_NOTE_KEYWORDS)
    cy.get('#search_field').type('shopping')
    cy.wait(500)
    cy.contains(THIRD_NOTE_TITLE)
  })
})

// TODO:
// - Test validation
// - Negative cases as well
