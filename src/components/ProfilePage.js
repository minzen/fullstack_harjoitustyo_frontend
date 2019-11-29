import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  SnackbarContent,
  Grid
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  textField: {
    marginLeft: 10,
    marginRight: 10,
    minWidth: 200,
    width: 400
  },
  button: {
    margin: 15
  },
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
  }
})

const EDIT_USER = gql`
  mutation editUser($email: String!, $givenname: String, $surname: String) {
    editUser(email: $email, givenname: $givenname, surname: $surname) {
      id
      email
      givenname
      surname
    }
  }
`

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $currentPassword: String!
    $newPassword: String!
    $newPassword2: String!
  ) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
      newPassword2: $newPassword2
    ) {
      id
      email
      givenname
      surname
    }
  }
`

const ProfilePage = ({ show, client, user, handleSpinnerVisibility }) => {
  const [givenname, setGivenname] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successDialogTitle, setSuccessDialogTitle] = useState('')
  const [successDialogContent, setSuccessDialogContent] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (user) {
      setGivenname(user.givenname)
      setSurname(user.surname)
      setEmail(user.email)
    }
  }, [user])

  if (!user) {
    return null
  }

  const handleGivennameChange = event => {
    setGivenname(event.target.value)
  }

  const handleSurnameChange = event => {
    setSurname(event.target.value)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handleEditUserSubmit = async event => {
    event.preventDefault()
    handleSpinnerVisibility(true)

    console.log(
      'Submit clicked, updating the data [givenname:',
      givenname,
      ', surname:',
      surname,
      'email:',
      email,
      ']'
    )

    try {
      const { data, loading, error } = await client.mutate({
        mutation: EDIT_USER,
        variables: { email: email, givenname: givenname, surname: surname }
      })
      if (data) {
        console.log('Response data of editUser', data)
        handleSpinnerVisibility(false)
        setSuccessDialogTitle('User data updated')
        setSuccessDialogContent('The user data have been updated successfully')
        handleDialogOpen()
      }
    } catch (e) {
      console.log('Error when updating user data', e)
      handleError(e)
      handleSpinnerVisibility(false)
    }
  }

  const handleCurrentPasswordChange = event => {
    setCurrentPassword(event.target.value)
  }

  const handleNewPasswordChange = event => {
    setNewPassword(event.target.value)
  }

  const handleNewPassword2Change = event => {
    setNewPassword2(event.target.value)
  }

  const handleChangePasswordSubmit = async event => {
    event.preventDefault()
    handleSpinnerVisibility(true)
    console.log(
      'Submit clicked, sending a request to change the password',
      currentPassword,
      newPassword,
      newPassword2
    )

    try {
      const { data, loading, error } = await client.mutate({
        mutation: CHANGE_PASSWORD,
        variables: {
          currentPassword: currentPassword,
          newPassword: newPassword,
          newPassword2: newPassword2
        }
      })
      if (data) {
        console.log('Response data of changePassword', data)
        if (data.changePassword !== null) {
          handleSpinnerVisibility(false)
          setCurrentPassword('')
          setNewPassword('')
          setNewPassword2('')
          setSuccessDialogTitle('Password changed')
          setSuccessDialogContent('Password changed successfully.')
          handleDialogOpen()
        }
      }
    } catch (e) {
      console.log('error when changing a password', e)
      handleError(e)
      handleSpinnerVisibility(false)
    }
  }

  const handleDialogOpen = () => {
    setShowSuccessDialog(true)
  }

  const handleDialogClose = () => {
    setShowSuccessDialog(false)
    setSuccessDialogTitle('')
    setSuccessDialogContent('')
  }

  const handleError = error => {
    console.log(error)
    setErrorMessage('Error: ' + error.graphQLErrors[0].message)
    setShowErrorNotification(true)
    setTimeout(() => {
      setErrorMessage(null)
      setShowErrorNotification(false)
    }, 6000)
  }

  if (!show) {
    return null
  }
  return (
    <>
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

      <Grid
        container
        spacing={2}
        direction='row'
        justify='center'
        alignItems='center'
      >
        <Grid item>
          <Card className={classes.card}>
            <CardHeader
              title='Basic user data'
              className={classes.cardHeader}
            />
            <CardContent>
              <form autoComplete='off'>
                <TextField
                  id='givenname_field'
                  variant='standard'
                  label='Givenname: '
                  onChange={handleGivennameChange}
                  value={givenname}
                  className={classes.textField}
                />
                <br />
                <TextField
                  id='surname_field'
                  variant='standard'
                  label='Surname: '
                  onChange={handleSurnameChange}
                  value={surname}
                  className={classes.textField}
                />
                <br />
                <TextField
                  id='email_field'
                  variant='standard'
                  label='Email: '
                  onChange={handleEmailChange}
                  value={email}
                  className={classes.textField}
                />
                <br />
                <br />
                {/* Data last modified: {user.modified} */}
                <Button
                  id='submit_user_data_button'
                  color='primary'
                  variant='contained'
                  onClick={handleEditUserSubmit}
                >
                  {' '}
                  Update user data
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.card}>
            <CardHeader
              title='Change password'
              className={classes.cardHeader}
            />
            <CardContent>
              <form>
                <TextField
                  id='currentpassword_field'
                  variant='standard'
                  label='Current password: '
                  onChange={handleCurrentPasswordChange}
                  value={currentPassword}
                  className={classes.textField}
                  type='password'
                />
                <TextField
                  id='newpassword_field'
                  variant='standard'
                  label='New password: '
                  onChange={handleNewPasswordChange}
                  value={newPassword}
                  className={classes.textField}
                  type='password'
                />
                <TextField
                  id='newpassword2_field'
                  variant='standard'
                  label='New password confirmation: '
                  onChange={handleNewPassword2Change}
                  value={newPassword2}
                  className={classes.textField}
                  type='password'
                />
                <br />
                <br />
                <Button
                  id='submit_new_password_button'
                  color='primary'
                  variant='contained'
                  onClick={handleChangePasswordSubmit}
                >
                  Change password
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={showSuccessDialog}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{successDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {successDialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            color='primary'
            variant='contained'
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default ProfilePage
