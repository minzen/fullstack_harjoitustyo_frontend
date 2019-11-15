import React, { useState, useEffect } from 'react'
import { Button, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    minWidth: 200,
    width: 400
  },
  button: {
    margin: 15
  }
})

const Profile = ({ show, client, user }) => {
  const [givenname, setGivenname] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
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

  const handleSubmitClick = event => {
    console.log(
      'Submit clicked, updating the data [givenname:',
      givenname,
      ', surname:',
      surname,
      'email:',
      email,
      ']'
    )
    // TODO
    //
  }

  if (!show) {
    return null
  }
  return (
    <div>
      <h2>Profile</h2>
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
        <Button color='primary' variant='contained' onClick={handleSubmitClick}>
          {' '}
          Update
        </Button>
      </form>
    </div>
  )
}
export default Profile
