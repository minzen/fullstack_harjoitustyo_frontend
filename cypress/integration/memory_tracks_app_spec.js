const utils = require('./utils')
const USER = 'teemu.testaaja@test.net'
const CURRENT_PWD = 'ThisIsMyPwd_2019'

describe('Login', function() {
  beforeEach(function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
  })

  it('front page can be opened', function() {
    cy.visit('/')
    cy.contains('Memory Tracks')
  })

  it('front page contains a login form with which the user may log in', function() {
    cy.visit('/')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.contains('Memory Tracks')
    cy.contains('Logout')
  })

  it('user types in invalid login credentials, and an error message is shown on the page', function() {
    cy.visit('/')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type('Jani')
    cy.get('#password_field').type('Seppä')
    cy.get('#login_button').click()
    cy.contains('Login')
    cy.contains('Error: wrong credentials')
  })
})

describe('Language Switch', function() {
  it('language switch on the front side switches the application language according to the selection', function() {
    cy.visit('/')
    cy.log('Checking the default language English')
    // Check that English is the default language
    cy.contains('Please login to the system')
    cy.log('Switching the language to Finnish')
    cy.get('[data-cy=language_selection]')
      .first()
      .click()
    cy.contains('Finnish')
      .trigger('mousemove')
      .click()
    cy.contains('Muistijäljet')
    cy.log('Switching the language to German')
    cy.get('[data-cy=language_selection]')
      .first()
      .click()
    cy.contains('saksa')
      .trigger('mousemove')
      .click()
    cy.contains('Teure Erinnerungen')
  })
})

// Test which views are not visible

describe('Logout', function() {
  it('a logged in user is able to see the logout button and may log out by using it', function() {
    cy.visit('/')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.get('#menu_logout_button').click()
    cy.contains('Login')
  })

  it('a not logged in user is not able to see the logout button', function() {
    cy.visit('/')
    cy.contains('Login')
    cy.contains('Register')
    cy.get('#menu_logout_button').should('not.exist')
  })
})
