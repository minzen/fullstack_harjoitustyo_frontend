import React, { useState, useEffect } from 'react'
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
import { validEmail } from '../../utils/Utils'

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

const EditUserCard = props => {
  const [givenname, setGivenname] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const classes = useStyles()
  const { t } = useTranslation()
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (props.user) {
      const user = props.user
      setGivenname(user.givenname)
      setSurname(user.surname)
      setEmail(user.email)
    }
  }, [props.user])

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

  const handleEditUserSubmit = async event => {
    event.preventDefault()
    props.handleSpinnerVisibility(true)

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
      const { data, loading, error } = await props.client.mutate({
        mutation: EDIT_USER,
        variables: { email: email, givenname: givenname, surname: surname }
      })
      if (!loading) {
        if (data) {
          console.log('Response data of editUser', data)
          props.handleSpinnerVisibility(false)
          props.setSuccessDialogTitle(t('User data updated'))
          props.setSuccessDialogContent(
            t('The user data have been updated successfully')
          )
          props.handleDialogOpen()
        }
        if (error) {
          console.log(error)
        }
      }
    } catch (e) {
      console.log('Error when updating user data', e)
      props.handleError(e)
      props.handleSpinnerVisibility(false)
    }
  }

  return (
    <Card className={classes.card}>
      <CardHeader title={t('Basic user data')} className={classes.cardHeader} />
      <CardContent>
        <form autoComplete='off'>
          <TextField
            id='givenname_field'
            variant='standard'
            label={t('Givenname')}
            onChange={handleGivennameChange}
            value={givenname}
            className={classes.textField}
          />
          <br />
          <TextField
            id='surname_field'
            variant='standard'
            label={t('Surname')}
            onChange={handleSurnameChange}
            value={surname}
            className={classes.textField}
          />
          <br />
          <TextField
            id='email_field'
            variant='standard'
            label={t('Email address')}
            error={error}
            required={true}
            onChange={handleEmailChange}
            value={email}
            className={classes.textField}
            helperText={errorText}
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
            {t('Update user data')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
export default EditUserCard
