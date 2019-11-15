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
})
describe('Memory Tracks with a logged in user', function() {
  it('a user logs in and sees an empty page with no notesk, and clicks the add button to create a new note', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(user)
    cy.get('#password_field').type(pwd)
    cy.get('#login_button').click()
    cy.contains('Stored Notes')
    cy.contains('No stored notes found')
    cy.get('#add_note_button').click()
  })
})
