import React, { useState } from 'react'
import { Grid, ButtonGroup, Button, Avatar } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import LoginForm from './components/LoginForm'
import Notes from './components/Notes'
import Profile from './components/Profile'
import { ApolloProvider } from 'react-apollo'
import { useApolloClient } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import NotesIcon from '@material-ui/icons/Notes'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
require('dotenv').config()

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      value
    }
  }
`

const useStyles = makeStyles({
  orangeAvatar: {
    width: 60,
    height: 60,
    color: 'white',
    backgroundColor: 'orange'
  }
})

const App = () => {
  const classes = useStyles()
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('notes')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const initials = () => {
    if (!loggedInUser) {
      return 'N/A'
    }

    const givenname =
      loggedInUser.givenname === null || loggedInUser.givenname === ''
        ? 'N'
        : loggedInUser.givenname.substring(0, 1)
    const surname =
      loggedInUser.surname === null ? 'N' : loggedInUser.surname.substring(0, 1)

    return givenname + surname
  }

  const handleError = error => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const client = useApolloClient()
  // If token -> logged in: Menu: Notes | Add Note (implement this as floating button) | Profile | Logout
  // If no token -> show login and some basic stuff
  // TODO: Checkout the possibilities to use App Bar of Material UI
  if (token) {
    return (
      <>
        <Grid container justify='center' spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid
              container
              spacing={1}
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Grid item>
                <ButtonGroup
                  variant='contained'
                  color='primary'
                  size='large'
                  aria-label='large contained primary button group'
                >
                  <Button
                    onClick={() => {
                      setPage('profile')
                    }}
                  >
                    <Avatar className={classes.orangeAvatar}>
                      {initials()}
                    </Avatar>
                  </Button>
                  <Button onClick={() => setPage('notes')}>
                    Notes&nbsp;
                    <NotesIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('TODO: Logout')
                      // TODO: clear the local storage etc.
                      setToken(null)
                    }}
                  >
                    Logout&nbsp;
                    <ExitToAppIcon />
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid item>
            <ApolloProvider client={client}>
              <Notes show={page === 'notes'} client={client} />
              {/* <Profile
                show={page === 'profile'}
                client={client}
                user={loggedInUser}
              /> */}
            </ApolloProvider>
          </Grid>
        </Grid>
      </>
    )
  } else {
    return (
      <Grid container justify='center'>
        <LoginForm login={login} setToken={token => setToken(token)} />
      </Grid>
    )
  }
}

export default App

/*
  const test_user = {
    id: 12345678,
    email: 'feetu.nyrhinen@gmail.com',
    givenname: 'Feetu',
    surname: 'Nyrhinen',
    keywords: ['linkki', 'react']
  }

*/
