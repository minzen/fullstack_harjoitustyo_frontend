import React, { useState, useEffect } from 'react'
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
//     editNote(id: ID!, title: String!, content: String!, keywords: [String]): Note
const EDIT_NOTE = gql`
  mutation editNote(
    $id: ID!
    $title: String!
    $content: String!
    $keywords: [String]
  ) {
    editNote(id: $id, title: $title, content: $content, keywords: $keywords) {
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
  const [noteId, setNoteId] = useState(null)
  const [visible, setVisible] = useState(false)
  const classes = useStyles()
  const client = props.client

  useEffect(() => {
    if (props.note) {
      if (props.note.title) {
        setTitle(props.note.title)
      }
      if (props.note.content) {
        setContent(props.note.content)
      }
      if (props.note.keywords) {
        setKeywords(props.note.keywords.join())
      }
      if (props.note.id) {
        setNoteId(props.note.id)
      }
    } else {
      resetForm()
    }
    setVisible(props.visible)
  }, [props.note, props.visible])

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleContentChange = event => {
    setContent(event.target.value)
  }

  const handleKeywordsChange = event => {
    setKeywords(event.target.value)
  }

  // Help method for getting the keywords as string array instead of a string
  // If no keywords are provided, an empty array is returned.
  const getKeywordsArrayFromString = keywords => {
    if (keywords) {
      // convert the string first to lower case to ensure everything is stored in a uniform way to the DB
      let keywordsInLowerCase = keywords.toLowerCase()
      // Split at comma and remove possible whitespaces
      let keywordsArr = keywordsInLowerCase.split(',')
      keywordsArr.forEach(currentItem => {
        currentItem.trim()
      })
      return keywordsArr
    }

    return []
  }

  const handleNewNoteSubmit = async event => {
    console.log('handleNewNoteSubmit', title, content, keywords)

    const keywordsArr = getKeywordsArrayFromString(keywords)

    try {
      const { data, loading, error } = await client.mutate({
        mutation: ADD_NOTE,
        variables: { title: title, content: content, keywords: keywordsArr }
      })
      if (data) {
        console.log('Response after carrying out the mutation ADD_NOTE', data)
        resetForm()
      }
    } catch (e) {
      console.log('error when saving a new note', e)
    }
  }

  const handleEditNoteSubmit = async event => {
    console.log('handleEditNoteSubmit', noteId, title, content, keywords)

    const keywordsArr = getKeywordsArrayFromString(keywords)
    try {
      const { data, loading, error } = await client.mutate({
        mutation: EDIT_NOTE,
        variables: {
          id: noteId,
          title: title,
          content: content,
          keywords: keywordsArr
        }
      })
      if (data) {
        console.log('Response after carrying out the mutation EDIT_NOTE', data)
        resetForm()
      }
    } catch (e) {
      console.log('error when saving a new note', e)
    }
  }

  const resetForm = () => {
    setNoteId(null)
    setTitle('')
    setContent('')
    setKeywords('')
  }

  if (visible) {
    return (
      <Grid>
        <form>
          <h3>Edit note</h3>
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
          <br />
          <TextField
            id='content_field'
            variant='standard'
            label='Content: '
            multiline
            className={classes.textField}
            onChange={handleContentChange}
            value={content}
          >
            Content
          </TextField>
          <br />
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
            id='save_note_button'
            variant='contained'
            color='primary'
            onClick={() => {
              if (props.note) {
                handleEditNoteSubmit()
              } else {
                handleNewNoteSubmit()
              }
            }}
            className={classes.button}
          >
            Save note
          </Button>
        </form>
      </Grid>
    )
  }
  return <></>
}
export default NoteForm
