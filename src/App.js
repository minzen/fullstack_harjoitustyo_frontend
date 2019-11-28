import React, { useState, useEffect } from 'react'
import {
  Grid,
  ButtonGroup,
  Button,
  Avatar,
  Typography,
  ThemeProvider,
  Snackbar,
  SnackbarContent
} from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation, useQuery, ApolloConsumer } from '@apollo/react-hooks'
import Notes from './components/Notes'
import Profile from './components/Profile'
import About from './components/About'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import { ApolloProvider, Query } from 'react-apollo'
import { useApolloClient } from '@apollo/react-hooks'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoadingOverlay from 'react-loading-overlay'
import { makeStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
//import ErrorIcon from '@material-ui/icons/Error'
import MemoryIcon from '@material-ui/icons/Memory'
import MyTheme from './styles/MyTheme'
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
      modified
    }
  }
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
  avatar: {
    width: 60,
    height: 60,
    color: 'white',
    backgroundColor: MyTheme.palette.secondary.main
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
  },
  errorIcon: {
    fontSize: 20
  },
  errorIconVariant: {
    opacity: 0.9,
    marginRight: MyTheme.spacing(1)
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center'
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
    console.log('useEffect')
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

  const buildInitialsForMenuAvatar = () => {
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
                        <Avatar className={classes.avatar}>
                          {buildInitialsForMenuAvatar()}
                        </Avatar>
                      </Button>
                      <Button
                        id='menu_notes_button'
                        onClick={() => setPage('notes')}
                      >
                        Memory Tracks&nbsp;
                        <MemoryIcon />
                      </Button>
                      <Button
                        id='menu_about_button'
                        onClick={() => {
                          setPage('about')
                        }}
                      >
                        About
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
                <Snackbar
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                  open={showErrorNotification}
                  variant='error'
                  autoHideDuration={6000}
                  onClose={console.log('snackbar/handleClose')}
                >
                  <SnackbarContent message={errorMessage} />
                </Snackbar>
              </Grid>
              <Grid item className={classes.noteDashboard}>
                <ApolloConsumer>
                  {client => (
                    <Query query={ALL_NOTES} pollInterval={2000}>
                      {result => (
                        <Notes
                          show={page === 'notes'}
                          client={client}
                          result={result}
                          handleSpinnerVisibility={handleSpinnerVisibility}
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
                    handleSpinnerVisibility={handleSpinnerVisibility}
                  ></Profile>
                </ApolloProvider>
              </Grid>
              <Grid item className={classes.aboutPage}>
                <About
                  show={page === 'about'}
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
              <ButtonGroup
                variant='contained'
                color='primary'
                size='large'
                aria-label='large contained primary button group'
              >
                <Button
                  id='menu_login_button'
                  onClick={() => {
                    setPage('login')
                  }}
                >
                  Login&nbsp;
                  <LockOpenIcon />
                </Button>
                <Button
                  id='menu_register_button'
                  onClick={() => {
                    setPage('register')
                  }}
                >
                  Register&nbsp;
                  <PersonAddIcon />
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <LoginPage
                show={page === 'login'}
                handleSpinnerVisibility={handleSpinnerVisibility}
                login={login}
                setToken={setToken}
              />
              <RegisterPage
                show={page === 'register'}
                handleSpinnerVisibility={handleSpinnerVisibility}
                register={register}
              />
            </Grid>
            <Grid item className={classes.aboutPage}>
              <About
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
                onClose={console.log('snackbar/handleClose')}
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
