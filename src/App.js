import React, { useState, useEffect } from 'react'
import { Grid, ButtonGroup, Button, Avatar } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation, useQuery, ApolloConsumer } from '@apollo/react-hooks'
import LoginForm from './components/LoginForm'
import RegisterUserForm from './components/RegisterUserForm'
import Notes from './components/Notes'
import Profile from './components/Profile'
import { ApolloProvider, Query } from 'react-apollo'
import { useApolloClient } from '@apollo/react-hooks'
import {
  ThemeProvider,
  Snackbar,
  SnackbarContent,
  Box
} from '@material-ui/core'
import LoadingOverlay from 'react-loading-overlay'
import { makeStyles } from '@material-ui/core/styles'
import NotesIcon from '@material-ui/icons/Notes'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
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
    background: 'linear-gradient(45deg, #ff4400 30%, #ff4411 90%)',
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
    backgroundColor: '#e3e5e8'
  },
  orangeAvatar: {
    width: 60,
    height: 60,
    color: 'white',
    backgroundColor: 'orange'
  },
  titleBox: {
    justify: 'center',
    color: 'black',
    backgroundColor: '#FF440C',
    padding: 20,
    fontSize: 30,
    maxWidth: 345
  },
  errorNotification: {
    backgroundColor: MyTheme.palette.error.light
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

  // If token -> logged in: Menu: Notes | Add Note (implement this as floating button) | Profile | Logout
  // If no token -> show login and some basic stuff
  // TODO: Checkout the possibilities to use App Bar of Material UI

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
                        <Avatar className={classes.orangeAvatar}>
                          {buildInitialsForMenuAvatar()}
                        </Avatar>
                      </Button>
                      <Button
                        id='menu_notes_button'
                        onClick={() => setPage('notes')}
                      >
                        Memory Tracks&nbsp;
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
            </Grid>
          </ThemeProvider>
        </LoadingOverlay>
      </>
    )
  } else {
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
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            spacing={1}
          >
            <Grid item>
              <Box className={classes.titleBox}>
                Memory Tracks &nbsp;
                <MemoryIcon />
              </Box>
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
            <Grid item>
              <LoginForm
                login={login}
                setToken={token => setToken(token)}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />
            </Grid>
            <Grid item>
              <RegisterUserForm
                addUser={register}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </LoadingOverlay>
    )
  }
}

export default App
