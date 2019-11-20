import React, { useState, useEffect } from 'react'
import { Grid, ButtonGroup, Button, Avatar } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation, useQuery, ApolloConsumer } from '@apollo/react-hooks'
import LoginForm from './components/LoginForm'
import RegisterUserForm from './components/RegisterUserForm'
import Notes from './components/Notes'
import Profile from './components/Profile'
import { ApolloProvider, Mutation, Query } from 'react-apollo'
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

const REGISTER = gql`
  mutation addUser(
    $email: String!
    $password: String!
    $givenname: String
    $surname: String
  ) {
    addUser(
      email: $email
      password: $password
      givenname: $givenname
      surname: $surname
    ) {
      id
      email
      givenname
      surname
    }
  }
`

const CURRENT_USER = gql`
  query {
    me {
      email
      givenname
      surname
      id
    }
  }
`
const ALL_NOTES = gql`
  query {
    allNotes {
      id
      title
      content
      keywords
      user {
        id
        email
      }
    }
  }
`

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  orangeAvatar: {
    width: 60,
    height: 60,
    color: 'white',
    backgroundColor: 'orange'
  },
  title: {
    justify: 'center',
    fontFamily: 'Cochin'
  }
})

const App = () => {
  const classes = useStyles()
  const [token, setToken] = useState()
  const [page, setPage] = useState('notes')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    console.log('useEffect')
    setToken(localStorage.getItem('memorytracks-user-token'))
  }, [])

  const handleError = error => {
    console.log(error)
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const [register] = useMutation(REGISTER, {
    onError: handleError
  })

  const { loading, error, data } = useQuery(CURRENT_USER)
  if (loading) return null

  if (error) return 'error'

  console.log(data)
  if (data && data.me && loggedInUser === null) {
    setLoggedInUser(data.me)
  }

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

  // If token -> logged in: Menu: Notes | Add Note (implement this as floating button) | Profile | Logout
  // If no token -> show login and some basic stuff
  // TODO: Checkout the possibilities to use App Bar of Material UI

  if (token) {
    return (
      <>
        <Grid
          container
          justify='center'
          spacing={3}
          className={classes.container}
        >
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
                    id='menu_profile_button'
                    onClick={() => {
                      setPage('profile')
                    }}
                  >
                    <Avatar className={classes.orangeAvatar}>
                      {initials()}
                    </Avatar>
                  </Button>
                  <Button
                    id='menu_notes_button'
                    onClick={() => setPage('notes')}
                  >
                    Notes&nbsp;
                    <NotesIcon />
                  </Button>
                  <Button
                    id='menu_logout_button'
                    onClick={() => {
                      localStorage.clear()
                      setToken(null)
                      client.resetStore()
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
            <ApolloConsumer>
              {client => (
                <Query query={ALL_NOTES} pollInterval={2000}>
                  {result => (
                    <Notes
                      show={page === 'notes'}
                      client={client}
                      result={result}
                    />
                  )}
                </Query>
              )}
            </ApolloConsumer>
            <ApolloProvider client={client}>
              <Profile
                show={page === 'profile'}
                client={client}
                user={loggedInUser}
              ></Profile>
            </ApolloProvider>
          </Grid>
        </Grid>
      </>
    )
  } else {
    return (
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        spacing={1}
      >
        <Grid item>
          <h1 className={classes.title}>Memory Tracks</h1>
        </Grid>
        <Grid item>
          <LoginForm login={login} setToken={token => setToken(token)} />
        </Grid>
        <Grid item>
          <RegisterUserForm addUser={register} />
        </Grid>
      </Grid>
    )
  }
}

export default App
