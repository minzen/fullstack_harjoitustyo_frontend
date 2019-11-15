import React, { useState } from 'react'
import { Fab, Dialog } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import NoteForm from './NoteForm'

const useStyles = makeStyles(theme => ({
  addButton: {
    marginTop: 50
  },
  dialog: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 400,
    width: 300
  }
}))

const AddNote = props => {
  const [modalVisible, setModalVisible] = useState(false)
  const classes = useStyles()

  return (
    <>
      <Fab
        id='add_note_button'
        color='primary'
        aria-label='Add note'
        onClick={() => {
          setModalVisible(true)
        }}
        className={classes.addButton}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={modalVisible}
        className={classes.dialog}
        onClose={() => setModalVisible(false)}
      >
        <NoteForm />
      </Dialog>
    </>
  )
}
export default AddNote
