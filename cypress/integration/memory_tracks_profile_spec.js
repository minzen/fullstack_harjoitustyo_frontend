const utils = require('./utils')
const USER = 'teemu.testaaja@test.net'
const GIVENNAME = 'Teemu'
const SURNAME = 'Testaaja'
const NEW_GIVENNAME = 'Team'
const NEW_SURNAME = 'Testaajax'
const CURRENT_PWD = 'ThisIsMyPwd_2019'
const NEW_PWD = 'ThisIsMyPwd_2019b'
const DEFAULT_TITLE = 'An interesting story about the Finnish football'
const DEFAULT_CONTENT =
  'https://dynamic.hs.fi/2019/karsintakuvat/?_ga=2.73417106.1043337552.1573848580-425762508.1569652028'
const DEFAULT_KEYWORDS = 'football'

describe('Profile functionalities', function() {
  this.beforeAll(function() {
    cy.log('Running the re-initialization of the test db')
    utils.initDb()
  })

  it('a logged in user is able to see the logout button and may log out by using it', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.get('#menu_logout_button').click()
    cy.contains('Login')
  })

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
  it('a logged in user is able to add a new note and the provided keywords are formatted properly', function() {
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

  describe('A logged in user wants to see/change his profile', function() {
    it('a user logs in and changes personal data (name)', function() {
      cy.visit('http://localhost:3000')
      cy.get('#email_field').type(USER)
      cy.get('#password_field').type(CURRENT_PWD)
      cy.get('#login_button').click()
      cy.wait(3000)
      cy.contains('TT')
      cy.get('#menu_profile_button').click()
      cy.contains('Profile')
      cy.contains(GIVENNAME)
      cy.contains(SURNAME)
      cy.get('#givenname_field').type(NEW_GIVENNAME)
      cy.get('#surname_field').type(NEW_SURNAME)
      cy.get('#submit_user_data_button').click()
      cy.contains(NEW_GIVENNAME)
      cy.contains(NEW_SURNAME)
    })

    // User types in the current password which is incorrect, and an error message is shown to the user
    // User types in the correct current password, and a new password twice, but as these do not match, an error message is shown to the user.
    // User types in the correct current password, and a new password twice (matching), and the password is changed after the submit. -> Logout and a new login with the new password.

    it('a user logs in and attempts to change his password, but as the passwords do not match, the operation fails and an error message is shown', function() {
      cy.visit('http://localhost:3000')
      cy.get('#email_field').type(USER)
      cy.get('#password_field').type(CURRENT_PWD)
      cy.get('#login_button').click()
      cy.wait(3000)
      cy.contains('TT')
      cy.get('#menu_profile_button').click()
      cy.contains('Profile')
      cy.contains(NEW_GIVENNAME)
      cy.contains(NEW_SURNAME)
      cy.get('#currentpassword_field').type(CURRENT_PWD)
      cy.get('#newpassword_field').type(NEW_PWD)
      cy.get('#newpassword2_field').type('ThisIsNotAMatchingPassword!!!')
      cy.get('#submit_new_password_button')
    })
  })
})

// TODO:
// - Test validation
// - Negative cases as well
// - Change user data
// - Change email (as used as ID, this should be more extensive)
// - Change password -> check login afterwards
