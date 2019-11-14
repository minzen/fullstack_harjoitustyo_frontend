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
                  <Button>
                    <Avatar className={classes.orangeAvatar}>FN</Avatar>
                  </Button>
                  <Button onClick={() => setPage('notes')}>
                    Notes&nbsp;
                    <NotesIcon />
                  </Button>
                  <Button onClick={() => setPage('profile')}>
                    Profile&nbsp;
                    <PersonIcon />
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
              <Profile show={page === 'profile'} client={client} />
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
