import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import MyTheme from '../../styles/MyTheme'
import { Snackbar, SnackbarContent, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ChangePasswordCard from '../cards/ChangePasswordCard'
import EditUserCard from '../cards/EditUserCard'
import SuccessDialog from '../dialogs/SuccessDialog'

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    email
    givenname
    surname
  }
`

const CURRENT_USER = gql`
  query {
    me {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
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
  },
  errorNotification: {
    backgroundColor: MyTheme.palette.error.main
  }
})

const ProfilePage = ({ show, client, token, handleSpinnerVisibility }) => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successDialogTitle, setSuccessDialogTitle] = useState('')
  const [successDialogContent, setSuccessDialogContent] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const { t } = useTranslation()
  const classes = useStyles()
  let loggedInUser

  const { loading, data } = useQuery(CURRENT_USER)
  if (!show || !token) {
    return null
  }

  if (loading) {
    return '<p>Loading</p>'
  }

  if (data && data.me) {
    loggedInUser = data.me
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
    setErrorMessage('Error: ' + error.graphQLErrors[0].message)
    setShowErrorNotification(true)
    setTimeout(() => {
      setErrorMessage(null)
      setShowErrorNotification(false)
    }, 6000)
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
        <SnackbarContent
          message={errorMessage}
          className={classes.errorNotification}
        />
      </Snackbar>

      <Grid
        container
        spacing={2}
        direction='row'
        justify='center'
        alignItems='center'
      >
        <Grid item>
          <EditUserCard
            user={loggedInUser}
            client={client}
            handleSpinnerVisibility={handleSpinnerVisibility}
            setSuccessDialogTitle={setSuccessDialogTitle}
            setSuccessDialogContent={setSuccessDialogContent}
            handleDialogOpen={handleDialogOpen}
            handleError={handleError}
          />
        </Grid>
        <Grid item>
          <ChangePasswordCard
            client={client}
            handleSpinnerVisibility={handleSpinnerVisibility}
            setSuccessDialogTitle={setSuccessDialogTitle}
            setSuccessDialogContent={setSuccessDialogContent}
            handleDialogOpen={handleDialogOpen}
            handleError={handleError}
          />
        </Grid>
      </Grid>

      <SuccessDialog
        open={showSuccessDialog}
        handleClose={handleDialogClose}
        title={successDialogTitle}
        content={successDialogContent}
        confirmationText={t('OK')}
      />
    </>
  )
}
export default ProfilePage
