import React, { useState, useEffect } from 'react'
import {
  Grid,
  Typography,
  ThemeProvider,
  Snackbar,
  SnackbarContent
} from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation, useQuery, ApolloConsumer } from '@apollo/react-hooks'
import { ApolloProvider, Query } from 'react-apollo'
import { useApolloClient } from '@apollo/react-hooks'
import LoadingOverlay from 'react-loading-overlay'
import { makeStyles } from '@material-ui/core/styles'
import NotesPage from './components/NotesPage'
import ProfilePage from './components/ProfilePage'
import AboutPage from './components/AboutPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import MyTheme from './styles/MyTheme'
import MenubarForLoggedInUser from './components/MenubarForLoggedInUser'
import MenubarForNoLoggedInUser from './components/MenubarForNoLoggedInUser'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  LOGIN_PAGE,
  NOTES_PAGE,
  PROFILE_PAGE,
  ABOUT_PAGE,
  REGISTER_PAGE
} from './constants/pages'
require('dotenv').config()

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      value
    }
  }
`

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    email
    givenname
    surname
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
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const CURRENT_USER = gql`
  query {
    me {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`
const ALL_NOTES = gql`
  query {
    allNotes {
      id
      title
      content
      keywords
      user {
        ...UserDetails
      }
      modified
    }
  }
  ${USER_DETAILS}
`

const useStyles = makeStyles({
  root: {
    background: MyTheme.palette.primary.main,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 80,
    padding: '0 30px',
    marginBottom: 10
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  noteDashboard: {
    // backgroundColor: '#e3e5e8'
  },
  titleBox: {
    justify: 'center',
    color: 'black',
    backgroundColor: MyTheme.palette.primary.main,
    padding: '0 30px',
    fontSize: 30
  },
  errorNotification: {
    backgroundColor: MyTheme.palette.error.main
  }
})

const App = () => {
  const classes = useStyles()
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('notes')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [spinnerActive, setSpinnerActive] = useState(false)
  const client = useApolloClient()

  useEffect(() => {
    console.log(LOGIN_PAGE, REGISTER_PAGE)
    setToken(localStorage.getItem('memorytracks-user-token'))
  }, [])

  const handleError = error => {
    console.log(error)
    setErrorMessage('Error: ' + error.graphQLErrors[0].message)
    setShowErrorNotification(true)
    setSpinnerActive(false)
    setTimeout(() => {
      setErrorMessage(null)
      setShowErrorNotification(false)
    }, 6000)
  }

  const handleSpinnerVisibility = value => {
    if (value) {
      setSpinnerActive(true)
    } else {
      setSpinnerActive(false)
    }
  }

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const [register] = useMutation(REGISTER, {
    onError: handleError
  })

  const { loading, error, data } = useQuery(CURRENT_USER)
  if (loading) {
    return null
  }
  if (error) {
    return 'error'
  }

  if (data.me && loggedInUser === null) {
    setLoggedInUser(data.me)
  }

  // User logged in, show the full app
  if (token) {
    return (
      <>
        <LoadingOverlay
          active={spinnerActive}
          spinner
          styles={{
            overlay: base => ({
              ...base,
              background: 'rgba(0, 0, 0, 0.5)'
            })
          }}
          text='Processing...'
        >
          <ThemeProvider theme={MyTheme}>
            <CssBaseline />
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
                  className={classes.root}
                >
                  <Grid item>
                    <MenubarForLoggedInUser
                      setPage={setPage}
                      setToken={setToken}
                      client={client}
                      loggedInUser={loggedInUser}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify='center'>
              <Grid item>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                  open={showErrorNotification}
                  variant='error'
                  autoHideDuration={6000}
                >
                  <SnackbarContent message={errorMessage} />
                </Snackbar>
              </Grid>
              <Grid item className={classes.noteDashboard}>
                <ApolloConsumer>
                  {client => (
                    <Query query={ALL_NOTES} pollInterval={2000}>
                      {result => (
                        <NotesPage
                          show={page === NOTES_PAGE}
                          client={client}
                          result={result}
                          handleSpinnerVisibility={handleSpinnerVisibility}
                        />
                      )}
                    </Query>
                  )}
                </ApolloConsumer>
                <ApolloProvider client={client}>
                  <ProfilePage
                    show={page === PROFILE_PAGE}
                    client={client}
                    user={loggedInUser}
                    handleSpinnerVisibility={handleSpinnerVisibility}
                  ></ProfilePage>
                </ApolloProvider>
              </Grid>
              <Grid item className={classes.aboutPage}>
                <AboutPage
                  show={page === ABOUT_PAGE}
                  client={client}
                  handleSpinnerVisibility={handleSpinnerVisibility}
                />
              </Grid>
            </Grid>
          </ThemeProvider>
        </LoadingOverlay>
      </>
    )
  } else {
    // User not logged in, show the registration, login and information about the application
    return (
      <LoadingOverlay
        active={spinnerActive}
        spinner
        styles={{
          overlay: base => ({
            ...base,
            background: 'rgba(0, 0, 0, 0.75)'
          })
        }}
        text='Processing...'
      >
        <ThemeProvider theme={MyTheme}>
          <CssBaseline />
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            spacing={1}
          >
            <Grid item>
              <Typography variant='h3' gutterBottom>
                Memory Tracks
              </Typography>
            </Grid>

            <Grid item>
              <MenubarForNoLoggedInUser setPage={setPage} />
            </Grid>
            <Grid item>
              <ApolloProvider client={client}>
                <LoginPage
                  show={page === LOGIN_PAGE}
                  handleSpinnerVisibility={handleSpinnerVisibility}
                  login={login}
                  client={client}
                  setToken={setToken}
                  setLoggedInUser={setLoggedInUser}
                />
              </ApolloProvider>
              <RegisterPage
                show={page === REGISTER_PAGE}
                handleSpinnerVisibility={handleSpinnerVisibility}
                register={register}
              />
            </Grid>
            <Grid item className={classes.aboutPage}>
              <AboutPage
                show={true}
                client={client}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />
            </Grid>

            <Grid item>
              <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
                open={showErrorNotification}
                variant='error'
                autoHideDuration={6000}
              >
                <SnackbarContent message={errorMessage} />
              </Snackbar>
            </Grid>
          </Grid>
        </ThemeProvider>
      </LoadingOverlay>
    )
  }
}

export default App
