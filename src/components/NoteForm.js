import React from 'react'
import { TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}))

const NoteForm = props => {
  const classes = useStyles()

  return (
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
  )
}
export default NoteForm
