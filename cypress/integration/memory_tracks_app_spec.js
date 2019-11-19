const user = 'teemu.testaaja@test.net'
const pwd = 'ThisIsMyPwd_2019'

describe('Memory Tracks with a user not logged in', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Memory Tracks')
  })
  it('front page contains a login form with which the user may log in', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(user)
    cy.get('#password_field').type(pwd)
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

describe('Memory Tracks with a logged in user', function() {
  it('a user logs in and sees an empty page with no notes, and clicks the add button to create a new note', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(user)
    cy.get('#password_field').type(pwd)
    cy.get('#login_button').click()
    cy.contains('Stored Notes')
    cy.contains('No stored notes found')
    cy.get('#add_note_button').click()
  })
  it('a logged in user is able to see the logout button and may log out by using it', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(user)
    cy.get('#password_field').type(pwd)
    cy.get('#login_button').click()
    cy.contains('Stored Notes')
    cy.get('#menu_logout_button').click()
    cy.contains('Login')
  })
  it('a user logs in and is able to access his/her profile page', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(user)
    cy.get('#password_field').type(pwd)
    cy.get('#login_button').click()
    cy.contains('Stored Notes')
    cy.get('#menu_profile_button').click()
    cy.contains('Profile')
  })
})
