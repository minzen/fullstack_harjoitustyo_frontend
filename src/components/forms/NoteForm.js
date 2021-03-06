import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Container
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ErrorBar from '../general/ErrorBar'

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
  const { t } = useTranslation()
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
        variables: {
          title: title,
          content: content,
          keywords: keywordsArr,
          archived: false
        }
      })
      if (!loading) {
        if (data) {
          props.handleSpinnerVisibility(false)
          console.log('Response after carrying out the mutation ADD_NOTE', data)
          resetForm()
        }
        if (error) {
          console.log(error)
        }
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
          keywords: keywordsArr,
          archived: false
        }
      })
      if (!loading) {
        if (data) {
          console.log(
            'Response after carrying out the mutation EDIT_NOTE',
            data
          )
          props.handleSpinnerVisibility(false)
          await resetForm()
        }
        if (error) {
          console.log(error)
        }
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
        <ErrorBar
          showErrorNotification={showErrorNotification}
          errorMessage={errorMessage}
        />

        <Container maxWidth='sm' className={classes.noteForm}>
          <form>
            <Card>
              <CardHeader
                title={t('Edit note')}
                className={classes.cardHeader}
              />
              <CardContent>
                <TextField
                  id='title_field'
                  variant='filled'
                  label={t('Title')}
                  data-cy='title_field'
                  className={classes.textField}
                  required={true}
                  onChange={handleTitleChange}
                  value={title}
                >
                  {t('Title')}
                </TextField>
                <br />
                <TextField
                  id='content_field'
                  variant='filled'
                  label={t('Content')}
                  data-cy='content_field'
                  multiline
                  className={classes.textField}
                  required={true}
                  onChange={handleContentChange}
                  value={content}
                >
                  {t('Content')}
                </TextField>
                <Button
                  id='paste_from_clipboard_button'
                  variant='contained'
                  color='primary'
                  onClick={handlePasteFromClipboard}
                >
                  {t('Paste')}
                </Button>
                <br />
                <TextField
                  id='keywords_field'
                  variant='filled'
                  label={t('Keywords')}
                  data-cy='keywords_field'
                  className={classes.textField}
                  onChange={handleKeywordsChange}
                  value={keywords}
                >
                  {t('Keywords')}
                </TextField>
                <br />
                <br />
                <Button
                  id='cancel_note_edit_button'
                  data-cy='cancel_edit_btn'
                  variant='contained'
                  color='default'
                  onClick={() => {
                    resetForm()
                    props.handleFormVisibility(false)
                  }}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  id='save_note_button'
                  data-cy='save_btn'
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  className={classes.button}
                  type='submit'
                >
                  {t('Save note')}
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
