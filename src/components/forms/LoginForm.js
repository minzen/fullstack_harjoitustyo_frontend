import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { gql } from 'apollo-boost'
import {
  Card,
  Button,
  TextField,
  CardHeader,
  Avatar,
  Collapse,
  CardContent,
  CardActions,
  Box,
  IconButton,
  Grid
} from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import LockIcon from '@material-ui/icons/Lock'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx'
import MyTheme from '../../styles/MyTheme'
import SuccessDialog from '../dialogs/SuccessDialog'
import { useTranslation } from 'react-i18next'
import { NOTES_PAGE } from '../../constants/pages'
import { validEmail } from '../../utils/Utils'

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    maxWidth: 345,
    backgroundColor: '#718792',
    marginTop: 15,
    marginRight: 10
  },
  cardHeader: {
    backgroundColor: '#1c313a',
    padding: 5,
    margin: 5
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: MyTheme.transitions.create('transform', {
      duration: MyTheme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: '#lightgrey',
    height: 70,
    width: 70,
    color: 'white'
  },
  textField: {
    marginLeft: MyTheme.spacing(1),
    marginRight: MyTheme.spacing(1),
    width: 240
  },
  button: {
    margin: MyTheme.spacing(1)
  }
})

const PASSWORD_RESET = gql`
  mutation resetPassword($email: String!) {
    passwordReset(email: $email)
  }
`

const LoginForm = props => {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [emailToRestorePwd, setEmailToRestorePwd] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')
  const { t } = useTranslation()
  const dateNow = new Date().toDateString()

  const handleEmailChange = event => {
    setEmail(event.target.value)
    if (!validEmail(event.target.value)) {
      setError(true)
      setErrorText('Incorrect entry. Please check the Email address format')
    } else {
      setError(false)
      setErrorText('')
    }
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleLoginSubmit = async () => {
    event.preventDefault()
    props.handleSpinnerVisibility(true)
    console.log('handle login submit')

    let passwordObfuscated = ''
    if (password) {
      for (let i = 0; i < password.length; i++) {
        passwordObfuscated += '*'
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
      // console.log('token obtained on login', result.data.login.value)
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('memorytracks-user-token', token)
      setEmail('')
      setPassword('')
    }
    props.handleSpinnerVisibility(false)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleEmailToRestorePwdChange = event => {
    setEmailToRestorePwd(event.target.value)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleSubmitPwdForgottenButton = async event => {
    props.handleSpinnerVisibility(true)
    event.preventDefault()
    console.log(
      'handleSubmitPwdForgottenButton for the user',
      emailToRestorePwd
    )
    // TODO: Validate the Email address
    const { data, loading, error } = await props.client.mutate({
      mutation: PASSWORD_RESET,
      variables: {
        email: emailToRestorePwd
      }
    })
    if (!loading) {
      if (data && data.passwordReset) {
        console.log('password reset result data: ', data)
        setShowDialog(true)
      } else if (error) {
        console.log(error)
      }
    }
    props.handleSpinnerVisibility(false)
  }

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label='login' className={classes.avatar}>
              {t('Login')}
            </Avatar>
          }
          title={t('Please login to the system with your credentials.')}
          subheader={dateNow}
        ></CardHeader>

        <CardContent>
          <form className={classes.container} autoComplete='on'>
            <Grid container spacing={1} alignItems='flex-end'>
              <Grid item>
                <EmailIcon />
              </Grid>
              <Grid item>
                <TextField
                  id='email_field'
                  className={classes.textField}
                  label={t('Email address')}
                  onChange={handleEmailChange}
                  variant='filled'
                  required={true}
                  color='secondary'
                  error={error}
                  helperText={errorText}
                  value={email}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1} alignItems='flex-end'>
              <Grid item>
                <LockIcon />
              </Grid>
              <Grid item>
                <TextField
                  id='password_field'
                  className={classes.textField}
                  label={t('Password')}
                  onChange={handlePasswordChange}
                  variant='outlined'
                  required={true}
                  color='secondary'
                  value={password}
                  type='password'
                />
              </Grid>
            </Grid>

            <Button
              id='login_button'
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={handleLoginSubmit}
              type='submit'
            >
              {t('Login')}
            </Button>
          </form>
        </CardContent>
        <CardActions disableSpacing>
          <div> {t('Password forgotten?')}</div>
          <div>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          </div>
        </CardActions>

        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Box fontWeight='fontWeightRegular'>{t('Password forgotten')}</Box>
            <form className={classes.container}>
              <Grid container spacing={1} alignItems='flex-end'>
                <Grid item>
                  <EmailIcon />
                </Grid>
                <Grid item>
                  <TextField
                    id='email_to_restore_password_field'
                    className={classes.textField}
                    label={t('Email to restore password')}
                    color='secondary'
                    required={true}
                    onChange={handleEmailToRestorePwdChange}
                    value={emailToRestorePwd}
                  />
                </Grid>
              </Grid>
              <Button
                id='submitEmailPwdForgottenButton'
                className={classes.button}
                variant='contained'
                color='secondary'
                onClick={handleSubmitPwdForgottenButton}
                type='submit'
              >
                {t('Restore Password')}
              </Button>
            </form>
          </CardContent>
        </Collapse>
      </Card>
      <SuccessDialog
        title={t('Password reset request sent')}
        content={t('Password reset request sent description')}
        confirmationText='OK'
        handleClose={handleClose}
        open={showDialog}
      />
    </>
  )
}
export default LoginForm
