import React, { useState } from 'react'
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EmailIcon from '@material-ui/icons/Email'
import LockIcon from '@material-ui/icons/Lock'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 240
  },
  textFieldWithIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 210
  },
  card: {
    backgroundColor: '#ffffff',
    maxWidth: 345,
    paddingTop: 20
  },
  cardHeader: {
    backgroundColor: '#dddddd'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  registerAvatar: {
    backgroundColor: '#FF6666',
    width: 80,
    height: 80
  },
  button: {
    margin: theme.spacing(1)
  },
  error: {
    color: 'red'
  }
}))

const RegisterUserForm = props => {
  const [givenname, setGivenname] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleGivennameChange = event => {
    setGivenname(event.target.value)
  }

  const handleSurnameChange = event => {
    setSurname(event.target.value)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleRegisterSubmit = async event => {
    event.preventDefault()
    // TODO: implement login after the registration
    console.log('submit registration', email, givenname, surname)
    const result = await props.addUser({
      variables: { email, password, givenname, surname }
    })
    if (result) {
      console.log('Registration completed for the user', result)
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

  const handleExpandClick = event => {
    setExpanded(!expanded)
  }

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label='register' className={classes.registerAvatar}>
              Register
            </Avatar>
          }
          title='In case you do not have a user account, please register a new account below.'
          subheader=''
        />

        <CardActions disableSpacing>
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
        </CardActions>

        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <form className={classes.container} autoComplete='off'>
              <TextField
                id='register_givenname'
                label='Givenname'
                value={givenname}
                onChange={handleGivennameChange}
                className={classes.textField}
              />
              <TextField
                id='register_surname'
                label='Surname'
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
                    label='Email'
                    value={email}
                    onChange={handleEmailChange}
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
                    label='Password'
                    value={password}
                    type='password'
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
              >
                Register
              </Button>
            </form>
          </CardContent>
        </Collapse>
      </Card>

      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>User registered</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            A user has been created. Please use your credentials to log in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default RegisterUserForm
