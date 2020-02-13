const utils = require('./utils')
const USER = 'teemu.testaaja@test.net'
const GIVENNAME = 'Teemu'
const SURNAME = 'Testaaja'
const NEW_GIVENNAME = 'SuperTeam'
const NEW_SURNAME = 'Testaajax'
const CURRENT_PWD = 'ThisIsMyPwd_2019'
const NEW_PWD = 'ThisIsMyPwd_2019b'
const HAVE_VALUE = 'have.value'

describe('View and change profile data', function() {
  beforeEach(function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
    cy.visit('/')
    cy.log('Executing login before each test!')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
  })

  it('the logged in user is able to see his/her profile data', function() {
    cy.contains('TT')
    cy.get('[data-cy="menuProfileBtn"]').click()
    cy.contains('Basic user data')
    cy.get('[data-cy=givennameFld] input').should(HAVE_VALUE, GIVENNAME)
    cy.get('[data-cy=surnameFld] input').should(HAVE_VALUE, SURNAME)
    cy.get('[data-cy=emailFld] input').should(HAVE_VALUE, USER)
  })

  it('the logged in user changes his/her personal data (givenname and surname)', function() {
    cy.contains('TT')
    cy.get('[data-cy=menuProfileBtn]').click()
    cy.get('[data-cy=givennameFld] input').should(HAVE_VALUE, GIVENNAME)
    cy.get('[data-cy=surnameFld] input').should(HAVE_VALUE, SURNAME)
    cy.get('[data-cy=givennameFld] input')
      .clear()
      .type(NEW_GIVENNAME)
    cy.get('[data-cy=surnameFld] input')
      .clear()
      .type(NEW_SURNAME)
    cy.get('#submit_user_data_button').click()
    // There should be a modal element that has to be confirmed
    cy.contains('User data updated')
    cy.get('#successConfirmButton').click()
    cy.get('[data-cy=givennameFld] input').should(HAVE_VALUE, NEW_GIVENNAME)
    cy.get('[data-cy=surnameFld] input').should(HAVE_VALUE, NEW_SURNAME)
    cy.get('[data-cy=emailFld] input').should(HAVE_VALUE, USER)
    // The new name of the user should result in the new avatar initials
    cy.contains('ST')
  })

  it('a password change operation fails due to that the given new password and its confirmation do not match', function() {
    cy.contains('TT')
    cy.get('[data-cy=menuProfileBtn]').click()
    cy.get('[data-cy=givennameFld] input').should(HAVE_VALUE, GIVENNAME)
    cy.get('[data-cy=surnameFld] input').should(HAVE_VALUE, SURNAME)
    cy.get('#currentpassword_field').type(CURRENT_PWD)
    cy.get('#newpassword_field').type(NEW_PWD)
    cy.get('#newpassword2_field').type('ThisIsNotAMatchingPassword!!!')
    cy.get('#submit_new_password_button').click()
    cy.contains('Error: The provided passwords differ from each other')
  })

  it('a password change operation fails due to that the provided current password is invalid', function() {
    cy.contains('TT')
    cy.get('[data-cy=menuProfileBtn]').click()
    cy.get('[data-cy=givennameFld] input').should(HAVE_VALUE, GIVENNAME)
    cy.get('[data-cy=surnameFld] input').should(HAVE_VALUE, SURNAME)
    cy.get('#currentpassword_field').type(
      'This is obviously an invalid password'
    )
    cy.get('#newpassword_field').type(NEW_PWD)
    cy.get('#newpassword2_field').type(NEW_PWD)
    cy.get('#submit_new_password_button').click()
    cy.contains('Error: not authenticated')
  })

  it('a password change operation is successful', function() {
    cy.contains('TT')
    cy.get('[data-cy=menuProfileBtn]').click()
    cy.get('[data-cy=givennameFld] input').should(HAVE_VALUE, GIVENNAME)
    cy.get('[data-cy=surnameFld] input').should(HAVE_VALUE, SURNAME)
    cy.get('#currentpassword_field').type(CURRENT_PWD)
    cy.get('#newpassword_field').type(NEW_PWD)
    cy.get('#newpassword2_field').type(NEW_PWD)
    cy.get('#submit_new_password_button').click()
    cy.contains('Password changed')
  })
})
