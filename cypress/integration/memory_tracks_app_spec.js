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
  })
})
