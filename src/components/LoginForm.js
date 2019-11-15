import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  Button,
  TextField,
  CardHeader,
  Avatar,
  Grid
} from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import LockIcon from '@material-ui/icons/Lock'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  },
  card: {
    maxWidth: 345,
    padding: 30
  },
  cardHeader: {
    backgroundColor: '#ccddcc'
  },
  avatar: {
    backgroundColor: 'green',
    width: 60,
    height: 60
  },
  buttonContainer: {
    marginTop: 10
  }
}))

const LoginForm = props => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [errorText, setErrorText] = useState(null)
  const dateNow = new Date().toDateString()
  const classes = useStyles()

  const setSubmitButtonState = () => {
    setButtonDisabled(false)
    // console.log('setSubmitState, email', email, 'password', password)
    // if (
    //   email === null ||
    //   email === '' ||
    //   password === null ||
    //   password === ''
    // ) {
    //   setButtonDisabled(true)
    // } else {
    //   setButtonDisabled(false)
    // }
  }

  const handleEmailChange = event => {
    console.log('handleEmailChange', event)
    setEmail(event.target.value)
    setSubmitButtonState()
  }

  const handlePasswordChange = event => {
    console.log(event.target.value)
    setPassword(event.target.value)
    setSubmitButtonState()
  }

  /*
    event.preventDefault()

    const result = await props.login({
      variables: { username, password }
    })

    if (result) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('kirjasto-user-token', token)
    }
*/

  const handleLoginSubmit = async event => {
    event.preventDefault()
    console.log('handle login submit', event)
    let passwordObfuscated = ''
    if (password) {
      for (let i = 0; i < password.length; i++) {
        passwordObfuscated += 'X'
      }
    }
    console.log(
      'Login pressed, login:',
      email,
      ', password (obfuscated):',
      passwordObfuscated
    )
    console.log('logging in the user....')
    const result = await props.login({
      variables: { email, password }
    })
    if (result) {
      console.log('token obtained on login', result.data.login.value)
      await props.setToken(result.data.login.value)
      await localStorage.setItem(
        'memorytracks-user-token',
        result.data.login.value
      )

      setEmail('')
      setPassword('')
    } else {
      setErrorText('Error: invalid credentials')
    }
  }

  return (
    <div>
      <h1>Memory Tracks</h1>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label='login' className={classes.avatar}>
              Login
            </Avatar>
          }
          title='Please login to the system'
          subheader={dateNow}
        />
        <form className={classes.container} autoComplete='on'>
          <Grid container spacing={1} alignItems='flex-end'>
            <Grid item>
              <EmailIcon />
            </Grid>
            <Grid item>
              <TextField
                id='email_field'
                className={classes.textField}
                label='Email address'
                onChange={handleEmailChange}
                value={email}
              />
            </Grid>
            <Grid container spacing={1} alignItems='flex-end'>
              <Grid item>
                <LockIcon />
              </Grid>
              <Grid item>
                <TextField
                  id='password_field'
                  className={classes.textField}
                  label='Password'
                  onChange={handlePasswordChange}
                  value={password}
                  type='password'
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            className={classes.buttonContainer}
            spacing={1}
            alignItems='flex-end'
          >
            <Grid item>
              <Button
                id='login_button'
                className={classes.button}
                disabled={buttonDisabled}
                variant='contained'
                color='primary'
                onClick={handleLoginSubmit}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
      <div>{errorText}</div>
    </div>
  )
}
export default LoginForm
