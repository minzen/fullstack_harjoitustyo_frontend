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

const ArchiveDialog = ({
  showDialog,
  handleAction,
  handleDialogClose,
  dialogTitle,
  dialogContent,
  dialogConfirmationText
}) => {
  const { t } = useTranslation()
  return (
    <Dialog
      open={showDialog}
      onClose={handleDialogClose}
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
          onClick={handleDialogClose}
          color='default'
          variant='contained'
        >
          {t('Cancel')}
        </Button>
        <Button
          data-cy='submitConfirmation'
          onClick={() => {
            handleDialogClose()
            handleAction()
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
export default ArchiveDialog
