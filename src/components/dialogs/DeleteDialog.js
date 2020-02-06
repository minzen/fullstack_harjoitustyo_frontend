import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const DeleteDialog = ({
  showDialog,
  handleDelete,
  handleDeleteDialogClose,
  dialogTitle,
  dialogContent,
  dialogConfirmationText
}) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={showDialog}
      onClose={handleDeleteDialogClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          data-cy='cancelConfirmation'
          onClick={handleDeleteDialogClose}
          color='default'
          variant='contained'
        >
          {t('Cancel')}
        </Button>
        <Button
          data-cy='submitConfirmation'
          onClick={() => {
            handleDeleteDialogClose()
            handleDelete()
          }}
          color='secondary'
          autoFocus
          variant='contained'
        >
          {dialogConfirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default DeleteDialog
