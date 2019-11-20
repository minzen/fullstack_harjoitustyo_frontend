const USER = 'teemu.testaaja@test.net'
const PWD = 'ThisIsMyPwd_2019'
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
    cy.get('#password_field').type(PWD)
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
  it('a logged in user is able to see the logout button and may log out by using it', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(PWD)
    cy.get('#login_button').click()
    cy.get('#menu_logout_button').click()
    cy.contains('Login')
  })

  // it('a user logs in and is able to access his/her profile page', function() {
  //   cy.visit('http://localhost:3000')
  //   cy.get('#email_field').type(USER)
  //   cy.get('#password_field').type(PWD)
  //   cy.get('#login_button').click()
  //   cy.contains('Stored Notes')
  //   cy.get('#menu_profile_button').click()
  //   cy.contains('Profile')
  // })

  it('a logged in user wants to delete an existing note, but clicks cancel on the confirmation modal element', function() {
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(PWD)
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
    cy.get('#password_field').type(PWD)
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
  it('a logged in user is able to add a new note', function() {
    const noteTitle = 'This is a fancy test note'
    const noteContent =
      'We can type in a bit more text and it should be shown on the card component.'
    const noteKeywords = 'KeyWord1,      ANOTHer Keyword'
    cy.visit('http://localhost:3000')
    cy.get('#email_field').type(USER)
    cy.get('#password_field').type(PWD)
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
})
