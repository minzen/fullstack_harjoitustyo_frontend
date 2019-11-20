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

describe('Memory Tracks with a user not logged in', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Memory Tracks')
  })
  it('front page contains a login form with which the user may log in', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.contains('Stored Notes')
  })
  it('user types in invalid credentials, and an error message is shown on the page', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type('Jani')
    cy.get('#password_field').type('Seppä')
    cy.get('#login_button').click()
    cy.contains('Login')
    cy.contains('Error: invalid credentials')
  })
})

// Test which views are not visible

describe('Memory Tracks with a logged in user', function() {
  it('a logged in user is able to see the logout button and may log out by using it', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(CURRENT_PWD)
    cy.get('#login_button').click()
    cy.get('#menu_logout_button').click()
    cy.contains('Login')
  })
})

// TODO:
// - Reset/Init DB after each round (no dependent tests)
// - Test validation
// - Negative cases as well
