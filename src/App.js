import React, { useState, useEffect } from 'react'
import { Grid, Typography, ThemeProvider } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation, ApolloConsumer } from '@apollo/react-hooks'
import { ApolloProvider, Query } from 'react-apollo'
import { useApolloClient } from '@apollo/react-hooks'
import LoadingOverlay from 'react-loading-overlay'
import { makeStyles } from '@material-ui/core/styles'
import NotesPage from './components/pages/NotesPage'
import ProfilePage from './components/pages/ProfilePage'
import AboutPage from './components/pages/AboutPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import ErrorBar from './components/general/ErrorBar'
import MyTheme from './styles/MyTheme'
import MenubarForLoggedInUser from './components/MenubarForLoggedInUser'
import MenubarForNoLoggedInUser from './components/MenubarForNoLoggedInUser'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useTranslation } from 'react-i18next'
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
      archived
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
    backgroundColor: MyTheme.palette.primary.error
  }
})

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState(LOGIN_PAGE)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [spinnerActive, setSpinnerActive] = useState(false)
  const { t } = useTranslation()
  const client = useApolloClient()
  const classes = useStyles()

  useEffect(() => {
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
    return setSpinnerActive(value)
  }

  const [login] = useMutation(LOGIN, {
    onError: handleError,
    onCompleted: () => {
      if (page !== NOTES_PAGE) {
        setPage(NOTES_PAGE)
      }
    }
  })

  const [register] = useMutation(REGISTER, {
    onError: handleError
  })

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
          text={t('Processing')}
        >
          <ThemeProvider theme={MyTheme}>
            <CssBaseline />
            <Grid
              container
              direction='column'
              spacing={1}
              className={classes.container}
            >
              <Grid item>
                <MenubarForLoggedInUser
                  setPage={setPage}
                  setToken={setToken}
                  client={client}
                  token={token}
                />
              </Grid>
              <Grid item>
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
              </Grid>
              <Grid item>
                <ApolloProvider client={client}>
                  <ProfilePage
                    show={page === PROFILE_PAGE}
                    client={client}
                    token={token}
                    handleSpinnerVisibility={handleSpinnerVisibility}
                  ></ProfilePage>
                </ApolloProvider>
              </Grid>
              <Grid item>
                <AboutPage show={page === ABOUT_PAGE} />
              </Grid>
              <Grid item>
                <ErrorBar
                  showErrorNotification={showErrorNotification}
                  errorMessage={errorMessage}
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
        text={t('Processing')}
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
                {t('Memory Tracks')}
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
                  setPage={setPage}
                />
              </ApolloProvider>
              <RegisterPage
                show={page === REGISTER_PAGE}
                handleSpinnerVisibility={handleSpinnerVisibility}
                register={register}
              />
            </Grid>
            <Grid item>
              <AboutPage show={page === ABOUT_PAGE} />
            </Grid>

            <Grid item>
              <ErrorBar
                showErrorNotification={showErrorNotification}
                errorMessage={errorMessage}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </LoadingOverlay>
    )
  }
}

export default App
