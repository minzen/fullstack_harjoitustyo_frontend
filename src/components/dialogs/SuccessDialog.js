import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'

/**
 * The dialog can be used to indicate the user about that a functionality has been finished, e.g. the registration is finished
 * @param {title} title bears the String to be shown on the dialog header
 * @param {content} content bears the String to be show on the dialog body
 * @param {confirmationText} text bears the String to be shown on the button that closes the dialog
 * @param {open} open is a boolean value that decides whether the dialog is visible
 * @param {handleClose} handleClose takes care of closing the dialog
 */
const SuccessDialog = ({
  title,
  content,
  confirmationText,
  handleClose,
  open
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id='successConfirmButton'
          data-cy='confirm_ok_user_registered'
          onClick={handleClose}
          color='primary'
          autoFocus
        >
          {confirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default SuccessDialog
