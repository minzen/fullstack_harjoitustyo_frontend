import React, { useState } from 'react'
import { Fab, Dialog, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  dialog: {
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
        color='primary'
        aria-label='Add note'
        onClick={() => {
          setModalVisible(true)
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={modalVisible}
        className={classes.dialog}
        onClose={() => setModalVisible(false)}
      >
        <form>
          <TextField>Title</TextField>
          <TextField>Content</TextField>
          <TextField>Keywords</TextField>
          <Button>Save note</Button>
        </form>
      </Dialog>
    </>
  )
}
export default AddNote
