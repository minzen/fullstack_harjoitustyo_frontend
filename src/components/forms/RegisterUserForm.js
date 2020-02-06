import React, { useState } from 'react'
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Collapse,
  CardActions,
  IconButton,
  Grid
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EmailIcon from '@material-ui/icons/Email'
import LockIcon from '@material-ui/icons/Lock'
import clsx from 'clsx'
import MyTheme from '../../styles/MyTheme'
import SuccessDialog from '../dialogs/SuccessDialog'
import { validEmail } from '../../utils/Utils'

const useStyles = makeStyles({
  textField: {
    marginLeft: MyTheme.spacing(1),
    marginRight: MyTheme.spacing(1),
    width: 240
  },
  textFieldWithIcon: {
    marginLeft: MyTheme.spacing(1),
    marginRight: MyTheme.spacing(1),
    width: 210
  },
  card: {
    backgroundColor: '#718792',
    maxWidth: 345,
    paddingTop: 20
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
  registerAvatar: {
    backgroundColor: '#455a64',
    width: 80,
    height: 80,
    color: 'white'
  },
  button: {
    margin: MyTheme.spacing(1)
  },
  error: {
    color: 'red'
  }
})

const RegisterUserForm = props => {
  const [givenname, setGivenname] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')
  const { t } = useTranslation()
  const classes = useStyles()

  const handleGivennameChange = event => {
    setGivenname(event.target.value)
  }

  const handleSurnameChange = event => {
    setSurname(event.target.value)
  }

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

  const handleRegisterSubmit = async event => {
    event.preventDefault()
    props.handleSpinnerVisibility(true)
    // TODO: implement login after the registration
    console.log('submit registration', email, givenname, surname)
    const result = await props.addUser({
      variables: { email, password, givenname, surname }
    })
    if (result) {
      console.log('Registration completed for the user', result)
      props.handleSpinnerVisibility(false)
      handleOpen()
      setEmail('')
      setPassword('')
      setGivenname('')
      setSurname('')
    }
  }

  const handleOpen = () => {
    setShowDialog(true)
  }
  const handleClose = () => {
    setShowDialog(false)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label='register' className={classes.registerAvatar}>
              {t('Register')}
            </Avatar>
          }
          title={t('Missing Account Text')}
          subheader=''
        />

        <CardActions disableSpacing>
          <IconButton
            data-cy='submit_expand_register_form'
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>

        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <form className={classes.container} autoComplete='off'>
              <TextField
                id='register_givenname'
                label={t('Givenname')}
                value={givenname}
                onChange={handleGivennameChange}
                className={classes.textField}
              />
              <TextField
                id='register_surname'
                label={t('Surname')}
                value={surname}
                onChange={handleSurnameChange}
                className={classes.textField}
              />
              <Grid container spacing={1} alignItems='flex-end'>
                <Grid item>
                  <EmailIcon />
                </Grid>
                <Grid item>
                  <TextField
                    id='register_email'
                    label={t('Email address')}
                    error={error}
                    value={email}
                    required={true}
                    onChange={handleEmailChange}
                    helperText={errorText}
                    className={classes.textFieldWithIcon}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems='flex-end'>
                <Grid item>
                  <LockIcon />
                </Grid>
                <Grid item>
                  <TextField
                    id='register_password'
                    label={t('Password')}
                    value={password}
                    type='password'
                    required={true}
                    onChange={handlePasswordChange}
                    className={classes.textFieldWithIcon}
                  />
                </Grid>
              </Grid>
              <Button
                id='register_submit_button'
                className={classes.button}
                variant='contained'
                color='primary'
                onClick={handleRegisterSubmit}
                type='submit'
              >
                {t('Register')}
              </Button>
            </form>
          </CardContent>
        </Collapse>
      </Card>

      <SuccessDialog
        title={t('User registered')}
        content={t('User registered text')}
        confirmationText='OK'
        handleClose={handleClose}
        open={showDialog}
      />
    </>
  )
}
export default RegisterUserForm
