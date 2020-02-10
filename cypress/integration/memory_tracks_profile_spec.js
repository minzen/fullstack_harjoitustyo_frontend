const utils = require('./utils')
const USER = 'teemu.testaaja@test.net'
const GIVENNAME = 'Teemu'
const SURNAME = 'Testaaja'
const NEW_GIVENNAME = 'SuperTeam'
const NEW_SURNAME = 'Testaajax'
const CURRENT_PWD = 'ThisIsMyPwd_2019'
const NEW_PWD = 'ThisIsMyPwd_2019b'

describe('A logged in user wants to see/change his profile', function() {
  this.beforeAll(function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
    cy.log('Test DB (re-)initialized')
  })

  beforeEach(function() {
    cy.visit('/')
    cy.log('Executing login before each test!')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
  })

  it('the logged in user is able to see his/her profile', function() {
    cy.visit('/')
    cy.get('[data-cy=menuProfileBtn]').click()
    cy.contains(GIVENNAME)
    cy.contains(SURNAME)
  })

  it('changes personal data (givenname and surname)', function() {
    cy.visit('/')
    cy.contains('TT')
    cy.get('[data-cy=menuProfileBtn]').click()
    cy.contains(GIVENNAME)
    cy.contains(SURNAME)
    cy.get('#givenname_field').type(NEW_GIVENNAME)
    cy.get('#surname_field').type(NEW_SURNAME)
    cy.get('#submit_user_data_button').click()
    cy.contains(NEW_GIVENNAME)
    cy.contains(NEW_SURNAME)
    // The new name of the user should result in the new avatar initials
    cy.contains('ST')
  })

  // User types in the current password which is incorrect, and an error message is shown to the user
  // User types in the correct current password, and a new password twice, but as these do not match, an error message is shown to the user.
  // User types in the correct current password, and a new password twice (matching), and the password is changed after the submit. -> Logout and a new login with the new password.

  it('an attempt to change the password of the user is carried out, but as the passwords do not match, the operation fails and an error message is shown', function() {
    cy.contains(NEW_GIVENNAME)
    cy.contains(NEW_SURNAME)
    cy.get('#currentpassword_field').type(CURRENT_PWD)
    cy.get('#newpassword_field').type(NEW_PWD)
    cy.get('#newpassword2_field').type('ThisIsNotAMatchingPassword!!!')
    cy.get('#submit_new_password_button')
  })
})

// TODO:
// - Test validation
// - Negative cases as well
// - Change user data
// - Change email (as used as ID, this should be more extensive)
// - Change password -> check login afterwards
