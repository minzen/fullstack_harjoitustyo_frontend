import React, { useState } from 'react'
import { Grid, ButtonGroup, Button } from '@material-ui/core'
import LoginForm from './components/LoginForm'
import Notes from './components/Notes'
import Profile from './components/Profile'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { useApolloClient } from '@apollo/react-hooks'
require('dotenv').config()

const App = () => {
  // const [token, setToken] = useState(true)
  const [page, setPage] = useState('notes')

  const client = useApolloClient()
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlZXR1Lm55cmhpbmVuQGdtYWlsLmNvbSIsImlkIjoiNWRjNTkyNGJlM2NkODM0MmU3Zjg4NzZiIiwiaWF0IjoxNTczNjU2MjE5fQ.lr9IzVvyOMNqEiJmvuixtOCMT3U2_PVp1AJYVmiLzoU'
  // If token -> logged in: Menu: Notes | Add Note (implement this as floating button) | Profile | Logout
  // If no token -> show login and some basic stuff
  if (token) {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} direction='column' alignItems='center'>
              <Grid item>
                <ButtonGroup
                  variant='contained'
                  color='primary'
                  size='large'
                  aria-label='large contained primary button group'
                >
                  <Button onClick={() => setPage('notes')}>Home (Icon)</Button>
                  <Button onClick={() => setPage('profile')}>Profile</Button>
                  <Button onClick={() => console.log('TODO: Logout')}>
                    Logout
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <h1>Memory Tracks</h1>
        <ApolloProvider client={client}>
          <Notes show={page === 'notes'} client={client} />
          <Profile show={page === 'profile'} client={client} />
        </ApolloProvider>
      </>
    )
  } else {
    return (
      <>
        <h1>Memory Tracks</h1>
        <LoginForm />
      </>
    )
  }
}

export default App
