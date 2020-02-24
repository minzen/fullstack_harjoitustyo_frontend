const utils = require('./utils')
const USER = 'end2endtester@example.net'
const PWD = 'Let us test with this one!'
const SHORT_PWD = 'h20e?'
const GIVENNAME = 'End to End'
const SURNAME = 'Tester'

describe('Creation of a user account', function() {
  it('types in the user details without providing a valid email address and gets an error notification', function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
    cy.visit('/')
    cy.get('#menu_register_button').click()
    cy.get('#register_givenname').type(GIVENNAME)
    cy.get('#register_surname').type(SURNAME)
    cy.get('#register_password').type(PWD)
    // cy.get('#register_password2').type(PWD) // TODO: Still missing on the form
    cy.get('#register_submit_button').click()
    cy.contains('Error: User validation failed: email')
  })

  it('types in the user details without a password and gets an error notification', function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
    cy.visit('/')
    cy.get('#menu_register_button').click()
    cy.get('#register_givenname').type(GIVENNAME)
    cy.get('#register_surname').type(SURNAME)
    cy.get('#register_email').type(USER)
    cy.get('#register_submit_button').click()
    cy.contains('Error: Invalid password')
  })

  it('types in the user details with too short a password and gets an error notification', function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
    cy.visit('/')
    cy.get('#menu_register_button').click()
    cy.get('#register_givenname').type(GIVENNAME)
    cy.get('#register_surname').type(SURNAME)
    cy.get('#register_email').type(USER)
    cy.get('#register_password').type(SHORT_PWD)
    cy.get('#register_submit_button').click()
    cy.contains('Error: Invalid password')
  })

  it('types in a valid email address and a valid password and gets a confirmation about that the user account was created', function() {
    cy.log('Running the re-initialization of the test db')
    utils.reInitTestDb()
    cy.visit('/')
    cy.get('#menu_register_button').click()
    cy.get('#register_givenname').type(GIVENNAME)
    cy.get('#register_surname').type(SURNAME)
    cy.get('#register_email').type(USER)
    cy.get('#register_password').type(PWD)
    cy.get('#register_submit_button').click()
  })

  it('another user account is attempted to be created by using the same email address as in the previous step, and an error notification is shown to the user', function() {
    cy.visit('/')
    cy.get('#menu_register_button').click()
    cy.get('#register_givenname').type(GIVENNAME)
    cy.get('#register_surname').type(SURNAME)
    cy.get('#register_email').type(USER)
    cy.get('#register_password').type(PWD)
    cy.get('#register_submit_button').click()
    cy.contains(
      'Error: User validation failed: email: Error, expected `email` to be unique.'
    )
  })
})
