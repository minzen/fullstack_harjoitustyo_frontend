import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { TextField, Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  button: {
    margin: 10
  }
}))

// addNote(title: String!, content: String!, keywords: [String]): Note
const ADD_NOTE = gql`
  mutation addNote($title: String!, $content: String!, $keywords: [String]) {
    addNote(title: $title, content: $content, keywords: $keywords) {
      id
      title
      content
      keywords
    }
  }
`

const NoteForm = props => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [keywords, setKeywords] = useState('')
  const classes = useStyles()

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleContentChange = event => {
    setContent(event.target.value)
  }

  const handleKeywordsChange = event => {
    setKeywords(event.target.value)
  }

  const handleNoteSubmit = async event => {
    console.log('handleNoteSubmit', title, content, keywords)
    const client = props.client

    try {
      const { data, loading, error } = await client.mutate({
        mutation: ADD_NOTE,
        variables: { title: title, content: content, keywords: keywords }
      })
      if (data) {
        console.log('Response after carrying out the mutation ADD_NOTE', data)
      }
    } catch (e) {
      console.log('error when saving a new note', e)
    }
  }

  return (
    <Grid>
      <form>
        <h3>Add new note</h3>
        <TextField
          id='title_field'
          variant='standard'
          label='Title: '
          className={classes.textField}
          onChange={handleTitleChange}
          value={title}
        >
          Title
        </TextField>
        <TextField
          id='content_field'
          variant='standard'
          label='Content: '
          className={classes.textField}
          onChange={handleContentChange}
          value={content}
        >
          Content
        </TextField>
        <TextField
          id='keywords_field'
          variant='standard'
          label='Keywords (comma-separated)'
          className={classes.textField}
          onChange={handleKeywordsChange}
          value={keywords}
        >
          Keywords
        </TextField>
        <br />
        <br />
        <Button
          id='cancel_button'
          variant='contained'
          color='default'
          onClick={console.log('CANCEL')}
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          id='save_note_button'
          variant='contained'
          color='primary'
          onClick={handleNoteSubmit}
          className={classes.button}
        >
          Save note
        </Button>
      </form>
    </Grid>
  )
}
export default NoteForm
