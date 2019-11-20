import React, { useState } from 'react'
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
  CardHeader
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

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
    backgroundColor: '#EEF0F1',
    marginTop: 15,
    marginRight: 10
  },
  cardHeader: {
    backgroundColor: '#CCCCCC',
    padding: 2
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

const Profile = ({ show, client, user }) => {
  const [givenname, setGivenname] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successDialogTitle, setSuccessDialogTitle] = useState('')
  const [successDialogContent, setSuccessDialogContent] = useState('')
  const classes = useStyles()

  if (!user) {
    return null
  } else {
    if (givenname === '') {
      setGivenname(user.givenname)
    }
    if (surname === '') {
      setSurname(user.surname)
    }
    if (email === '') {
      setEmail(user.email)
    }
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
        setSuccessDialogTitle('User data updated')
        setSuccessDialogContent('The user data have been updated successfully')
        handleDialogOpen()
      }
    } catch (e) {
      console.log('Error when updating user data', e)
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

  if (!show) {
    return null
  }
  return (
    <>
      <h2>Profile</h2>
      <Card className={classes.card}>
        <CardHeader title='Basic user data' className={classes.cardHeader} />
        <CardContent>
          <form>
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

      <Card className={classes.card}>
        <CardHeader title='Change password' className={classes.cardHeader} />
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
export default Profile
