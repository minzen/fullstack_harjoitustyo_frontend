const utils = require('./utils')
const USER = 'teemu.testaaja@test.net'
const CURRENT_PWD = 'ThisIsMyPwd_2019'

describe('Testing the login/logout with a user not logged in', function() {
  this.beforeAll(function() {
    cy.log('Running the re-initialization of the test db')
    utils.initDb()
  })

  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Memory Tracks')
  })

  it('front page contains a login form with which the user may log in', function() {
    cy.visit('http://localhost:3000')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.contains('Memory Tracks')
    cy.contains('Logout')
  })

  it('user types in invalid credentials, and an error message is shown on the page', function() {
    cy.visit('http://localhost:3000')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type('Jani')
    cy.get('#password_field').type('Seppä')
    cy.get('#login_button').click()
    cy.contains('Login')
    cy.contains('Error: wrong credentials')
  })

  it('language switch on the front side switches the application language according to the selection', function() {
    cy.visit('http://localhost:3000')
    cy.log('Checking the default language English')
    // Check that English is the default language
    cy.contains('The application enables storing of')
    cy.log('Switching the language to Finnish')
    cy.get('[data-cy=language_selection').first().click()
    cy.contains('Finnish').trigger('mousemove').click()
    cy.contains('Muistijäljet')
    cy.contains('Sovellus')
    cy.log('Switching the language to German')
    cy.get('[data-cy=language_selection]').first().click()
    cy.contains('saksa').trigger('mousemove').click()
    cy.contains('Teure Erinnerungen')
    cy.contains('Allgemeines')
  })
})

// Test which views are not visible

describe('Testing the logout with a logged in user', function() {
  it('a logged in user is able to see the logout button and may log out by using it', function() {
    cy.visit('http://localhost:3000')
    // Click the menu bar button to get the login view
    cy.get('#menu_login_button').click()
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.get('#menu_logout_button').click()
    cy.contains('Login')
  })
})

// TODO:
// - Test validation
// - Negative cases as well
// - Test translations
