import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useTranslation } from 'react-i18next'
import ChangePasswordCard from '../cards/ChangePasswordCard'
import EditUserCard from '../cards/EditUserCard'
import SuccessDialog from '../dialogs/SuccessDialog'
import Loading from '../general/Loading'
import ErrorBar from '../general/ErrorBar'

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

const ProfilePage = ({ show, client, token, handleSpinnerVisibility }) => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successDialogTitle, setSuccessDialogTitle] = useState('')
  const [successDialogContent, setSuccessDialogContent] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const { t } = useTranslation()
  let loggedInUser

  const { loading, data } = useQuery(CURRENT_USER)
  if (!show || !token) {
    return null
  }

  if (loading) {
    return <Loading />
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
      <ErrorBar
        showErrorNotification={showErrorNotification}
        errorMessage={errorMessage}
      />

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
