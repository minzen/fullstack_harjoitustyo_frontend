import React, { useState } from 'react'
import { Fab, Dialog, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  dialog: {
    height: 400,
    width: 300
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
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
          <TextField id='title_field' className={classes.textField}>
            Title
          </TextField>
          <TextField id='content_field' className={classes.textField}>
            Content
          </TextField>
          <TextField id='keywords_field' className={classes.textField}>
            Keywords
          </TextField>
          <Button id='save_note_button' variant='contained'>
            Save note
          </Button>
        </form>
      </Dialog>
    </>
  )
}
export default AddNote
