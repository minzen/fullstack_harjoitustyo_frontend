import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { gql } from 'apollo-boost'
import { useTranslation } from 'react-i18next'

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

const ChangePasswordCard = props => {
  const classes = useStyles()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const { t } = useTranslation()

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
    props.handleSpinnerVisibility(true)
    console.log(
      'Submit clicked, sending a request to change the password',
      currentPassword,
      newPassword,
      newPassword2
    )

    try {
      const { data, loading, error } = await props.client.mutate({
        mutation: CHANGE_PASSWORD,
        variables: {
          currentPassword: currentPassword,
          newPassword: newPassword,
          newPassword2: newPassword2
        }
      })
      if (!loading) {
        if (data) {
          console.log('Response data of changePassword', data)
          if (data.changePassword !== null) {
            props.handleSpinnerVisibility(false)
            setCurrentPassword('')
            setNewPassword('')
            setNewPassword2('')
            props.setSuccessDialogTitle('Password changed')
            props.setSuccessDialogContent('Password changed successfully.')
            props.handleDialogOpen()
          }
        }
        if (error) {
          console.log(error)
        }
      }
    } catch (e) {
      console.log('error when changing a password', e)
      props.handleError(e)
      props.handleSpinnerVisibility(false)
    }
  }

  return (
    <Card className={classes.card}>
      <CardHeader title='Change password' className={classes.cardHeader} />
      <CardContent>
        <form>
          <TextField
            id='currentpassword_field'
            variant='standard'
            label={t('Current password')}
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            className={classes.textField}
            type='password'
          />
          <TextField
            id='newpassword_field'
            variant='standard'
            label={t('New password')}
            onChange={handleNewPasswordChange}
            value={newPassword}
            className={classes.textField}
            type='password'
          />
          <TextField
            id='newpassword2_field'
            variant='standard'
            label={t('New password confirmation')}
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
            {t('Change password')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
export default ChangePasswordCard
