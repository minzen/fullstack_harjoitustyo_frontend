import React from 'react'
import { Snackbar, SnackbarContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MyTheme from '../../styles/MyTheme'

const useStyles = makeStyles({
  errorNotification: {
    backgroundColor: MyTheme.palette.primary.error
  }
})

const ErrorBar = ({ showErrorNotification, errorMessage }) => {
  const classes = useStyles()
  return (
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
  )
}
export default ErrorBar
