import React, { useState } from 'react'
import { Grid, ButtonGroup, Button, Avatar } from '@material-ui/core'
import LoginForm from './components/LoginForm'
import Notes from './components/Notes'
import Profile from './components/Profile'
import { ApolloProvider } from 'react-apollo'
import { useApolloClient } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import NotesIcon from '@material-ui/icons/Notes'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { SourceMapGenerator } from 'source-map'
require('dotenv').config()

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
  const [token, setToken] = useState(true)
  const [page, setPage] = useState('notes')

  const test_user = {
    id: 12345678,
    email: 'feetu.nyrhinen@gmail.com',
    givenname: 'Feetu',
    surname: 'Nyrhinen',
    keywords: ['linkki', 'react']
  }

  const [loggedInUser, setLoggedInUser] = useState(test_user)

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
              <Profile
                show={page === 'profile'}
                client={client}
                user={loggedInUser}
              />
            </ApolloProvider>
          </Grid>
        </Grid>
      </>
    )
  } else {
    return (
      <Grid container justify='center'>
        <LoginForm />
      </Grid>
    )
  }
}

export default App
