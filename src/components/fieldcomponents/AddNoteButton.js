import React from 'react'
import { Fab } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import MyTheme from '../../styles/MyTheme'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles({
  fab: {
    position: 'fixed',
    bottom: MyTheme.spacing(2),
    right: MyTheme.spacing(2)
  }
})

const AddNoteButton = props => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Fab
      id='add_note_button'
      color='primary'
      aria-label={t('Add note')}
      onClick={() => {
        props.handleEditNoteClick(null)
      }}
      className={classes.fab}
    >
      <AddIcon />
    </Fab>
  )
}
export default AddNoteButton
