import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  SnackbarContent,
  Container
} from '@material-ui/core'
import ContentPaste from 'mdi-material-ui/ContentPaste'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 350,
    backgroundColor: '#1c313a'
  },
  noteForm: {
    backgroundColor: '#718792',
    padding: 10
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
  const [errorMessage, setErrorMessage] = useState(null)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const classes = useStyles()
  const client = props.client

  let visible = props.visible

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
  }, [props.note])

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleContentChange = event => {
    setContent(event.target.value)
  }

  const handleKeywordsChange = event => {
    setKeywords(event.target.value)
  }

  const handleError = error => {
    console.log(error)
    setErrorMessage('Error: ' + error.graphQLErrors[0].message)
    setShowErrorNotification(true)
    setTimeout(() => {
      setErrorMessage(null)
      setShowErrorNotification(false)
    }, 6000)
  }

  // Help method for getting the keywords as string array instead of a string
  // If no keywords are provided, an empty array is returned.
  const getKeywordsArrayFromString = keywords => {
    if (keywords) {
      // convert the string first to lower case to ensure everything is stored in a uniform way to the DB
      let keywordsInLowerCase = keywords.toLowerCase()
      // Split at comma and remove possible whitespaces
      let keywordsArr = keywordsInLowerCase.split(',')
      console.log('array before trim()', keywordsArr)
      let trimmedKeywords = []
      keywordsArr.forEach(currentItem => {
        const trimmed = currentItem.trim()
        trimmedKeywords.push(trimmed)
      })
      console.log('array after trim()', trimmedKeywords)
      return trimmedKeywords
    }

    return []
  }
  const handleSubmit = async event => {
    if (props.note) {
      await handleEditNoteSubmit(event)
    } else {
      await handleNewNoteSubmit(event)
    }
    props.handleFormVisibility(false)
  }

  const handleNewNoteSubmit = async event => {
    event.preventDefault()
    console.log('handleNewNoteSubmit', title, content, keywords)
    props.handleSpinnerVisibility(true)
    const keywordsArr = getKeywordsArrayFromString(keywords)

    try {
      const { data, loading, error } = await client.mutate({
        mutation: ADD_NOTE,
        variables: { title: title, content: content, keywords: keywordsArr }
      })
      if (data) {
        props.handleSpinnerVisibility(false)
        console.log('Response after carrying out the mutation ADD_NOTE', data)
        resetForm()
      }
    } catch (e) {
      props.handleSpinnerVisibility(false)
      console.log('error when saving a new note', e)
      handleError(e)
    }
  }

  const handleEditNoteSubmit = async event => {
    event.preventDefault()
    resetForm()
    console.log('handleEditNoteSubmit', noteId, title, content, keywords)
    props.handleSpinnerVisibility(true)
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
        props.handleSpinnerVisibility(false)
        resetForm()
      }
      props.handleSpinnerVisibility(false)
    } catch (e) {
      console.log('error when saving a new note', e)
      handleError(e)
    }
  }

  const resetForm = async () => {
    setNoteId(null)
    setTitle('')
    setContent('')
    setKeywords('')
  }

  const handlePasteFromClipboard = async () => {
    console.log('Pasting from the clipboard')
    try {
      const contentToPaste = await navigator.clipboard.readText()
      console.log('Pasted from clipboard', contentToPaste)
      if (contentToPaste && contentToPaste.length > 0) {
        setContent(contentToPaste)
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (visible) {
    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={showErrorNotification}
          variant='error'
          autoHideDuration={6000}
        >
          <SnackbarContent message={errorMessage} />
        </Snackbar>

        <Container maxWidth='sm' className={classes.noteForm}>
          <form>
            <Card>
              <CardHeader title='Edit note' className={classes.cardHeader} />
              <CardContent>
                <TextField
                  id='title_field'
                  variant='filled'
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
                  variant='filled'
                  label='Content: '
                  multiline
                  className={classes.textField}
                  onChange={handleContentChange}
                  value={content}
                >
                  Content
                </TextField>
                <Button
                  id='paste_from_clipboard_button'
                  variant='contained'
                  color='primary'
                  onClick={handlePasteFromClipboard}
                >
                  <ContentPaste />
                  Paste
                </Button>
                <br />
                <TextField
                  id='keywords_field'
                  variant='filled'
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
                  id='cancel_note_edit_button'
                  variant='contained'
                  color='default'
                  onClick={() => {
                    resetForm()
                    props.handleFormVisibility(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  id='save_note_button'
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  className={classes.button}
                  type='submit'
                >
                  Save note
                </Button>
              </CardContent>
            </Card>
          </form>
        </Container>
      </>
    )
  }
  return <></>
}
export default NoteForm
