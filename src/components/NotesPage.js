import React, { useState, useRef } from 'react'
import { gql } from 'apollo-boost'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import NoteForm from './NoteForm'
import DeleteDialog from './DeleteDialog'
import Note from './Note'
import SearchField from './SearchField'
import MyTheme from '../styles/MyTheme'

const ALL_NOTES = gql`
  query {
    allNotes {
      id
      title
      content
      keywords
      user {
        id
        email
      }
      modified
    }
  }
`

const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`

const GET_NOTES_BY_KEYWORD = gql`
  query notesByKeyword($keyword: String) {
    notesByKeyword(keyword: $keyword) {
      id
      title
      content
      keywords
      modified
    }
  }
`

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: MyTheme.spacing(2)
  },
  textField: {
    width: 240
  },
  fab: {
    position: 'fixed',
    bottom: MyTheme.spacing(2),
    right: MyTheme.spacing(2)
  }
})

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

const NotesPage = ({ show, client, result, handleSpinnerVisibility }) => {
  const classes = useStyles()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editNoteVisible, setEditNoteVisible] = useState(false)
  const [filteredNotes, setFilteredNotes] = useState(null)
  const noteFormRef = useRef(null)
  const scrollToNoteForm = () => scrollToRef(noteFormRef)
  let notes

  if (!show) {
    return null
  }

  if (result && result.loading) {
    return <div>loading...</div>
  }

  notes = result.data.allNotes

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false)
  }

  const handleDeleteDialogOpen = () => {
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    console.log('handleDelete', selectedNote.id)
    handleSpinnerVisibility(true)

    try {
      const { data, loading, error } = await client.mutate({
        mutation: DELETE_NOTE,
        variables: {
          id: selectedNote.id
        },
        refetchQueries: [{ query: ALL_NOTES }]
      })
      if (data) {
        handleSpinnerVisibility(false)
        console.log('Response data of deleteNote', data)
        setSelectedNote(null)
      }
    } catch (e) {
      console.log('error when deleting a note', e)
      handleSpinnerVisibility(false)
    }
  }

  const handleSearchTermChange = async event => {
    console.log('Current search term', event.target.value)
    await setSearchTerm(event.target.value)
  }

  const execFiltering = async event => {
    event.preventDefault()
    // Filter the notes by the provided search term
    if (!searchTerm || searchTerm.trim() === '') {
      await showNotes()
    } else {
      await showNotes(searchTerm)
    }
  }

  const showNotes = async keyword => {
    console.log('showNotes', keyword)
    handleSpinnerVisibility(true)
    if (!keyword || keyword.trim() === '') {
      setFilteredNotes(null)
      handleSpinnerVisibility(false)
      return
    }
    console.log('Showing notes by keyword', keyword)
    try {
      const { data } = await client.query({
        query: GET_NOTES_BY_KEYWORD,
        variables: { keyword: keyword }
      })
      console.log(data)
      setFilteredNotes(data.notesByKeyword)
      handleSpinnerVisibility(false)
    } catch (e) {
      console.log(e)
      handleSpinnerVisibility(false)
    }
  }

  const handleEditNoteClick = async note => {
    console.log('handleEditNoteClick', note)
    await setEditNoteVisible(true)
    await setSelectedNote(note)
    await scrollToNoteForm()
  }

  const handleDeleteNoteClick = async note => {
    await setEditNoteVisible(false)
    await setSelectedNote(note)
    await scrollToNoteForm()
    await handleDeleteDialogOpen()
  }

  const handleSearchAll = async event => {
    event.preventDefault()
    await setSearchTerm('')
    await showNotes()
  }

  const handleFormVisibility = async value => {
    if (value) {
      setEditNoteVisible(true)
    } else {
      setEditNoteVisible(false)
    }
  }

  console.log('filteredNotes', filteredNotes)
  console.log('notes', notes)

  if (filteredNotes) {
    if (filteredNotes.length > 0) {
      return (
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='center'
            alignItems='center'
          >
            <SearchField
              handleSubmit={execFiltering}
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
              handleSearchAll={handleSearchAll}
            />
          </Grid>

          <Grid
            container
            spacing={2}
            direction='row'
            justify='flex-start'
            alignItems='flex-start'
          >
            {filteredNotes.map(note => {
              return (
                <Grid item xs={12} sm={6} md={3} key={note.id}>
                  <Note
                    key={note.id}
                    note={note}
                    handleEditNoteClick={() => {
                      return handleEditNoteClick(note)
                    }}
                    handleDeleteNoteClick={handleDeleteNoteClick}
                  />
                </Grid>
              )
            })}
          </Grid>

          <Grid
            container
            spacing={2}
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Grid item>
              <div ref={noteFormRef} />
              <NoteForm
                client={client}
                note={selectedNote}
                visible={editNoteVisible}
                handleFormVisibility={handleFormVisibility}
                handleEditNoteClick={() => {
                  return handleEditNoteClick(selectedNote)
                }}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />
            </Grid>
          </Grid>

          <Fab
            id='add_note_button'
            color='primary'
            aria-label='Add note'
            onClick={note => {
              handleEditNoteClick(null)
            }}
            className={classes.fab}
          >
            <AddIcon />
          </Fab>

          <DeleteDialog
            showDialog={showDeleteDialog}
            handleDelete={handleDelete}
            handleDeleteDialogClose={handleDeleteDialogClose}
            dialogTitle='Delete note?'
            dialogContent='Are you certain that you want to delete the note?'
          />
        </div>
      )
    } else {
      return (
        <>
          <Grid container className={classes.container} justify='center'>
            <Grid container spacing={1} direction='column' alignItems='center'>
              <h2>Stored Notes</h2>
            </Grid>
            <SearchField
              handleSubmit={execFiltering}
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
              handleSearchAll={handleSearchAll}
            />
            <Grid container spacing={1} direction='column' alignItems='center'>
              <p>No stored notes found.</p>
              <br />
              <br />
              <Grid
                container
                spacing={2}
                direction='column'
                justify='center'
                alignItems='center'
              >
                <Grid item>
                  <div ref={noteFormRef} />
                  <NoteForm
                    client={client}
                    note={null}
                    visible={editNoteVisible}
                    handleFormVisibility={handleFormVisibility}
                    handleSpinnerVisibility={handleSpinnerVisibility}
                  />
                </Grid>
              </Grid>
              <Fab
                id='add_note_button'
                color='primary'
                aria-label='Add note'
                onClick={note => {
                  handleEditNoteClick(null)
                }}
                className={classes.fab}
              >
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </>
      )
    }
  } else {
    if (notes && notes.length > 0) {
      return (
        <div className={classes.root}>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='center'
            alignItems='center'
          >
            <Grid item>
              <SearchField
                handleSubmit={execFiltering}
                searchTerm={searchTerm}
                handleSearchTermChange={handleSearchTermChange}
                handleSearchAll={handleSearchAll}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            direction='row'
            justify='flex-start'
            alignItems='flex-start'
          >
            {notes.map(note => {
              return (
                <Grid item xs={12} sm={6} md={3} key={note.id}>
                  <Note
                    key={note.id}
                    note={note}
                    handleEditNoteClick={handleEditNoteClick}
                    handleDeleteNoteClick={handleDeleteNoteClick}
                  />
                </Grid>
              )
            })}
          </Grid>

          <Grid
            container
            spacing={2}
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Grid item>
              <div ref={noteFormRef} />
              <NoteForm
                client={client}
                note={selectedNote}
                visible={editNoteVisible}
                handleFormVisibility={handleFormVisibility}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />
            </Grid>
          </Grid>
          <Fab
            id='add_note_button'
            color='primary'
            aria-label='Add note'
            onClick={note => {
              handleEditNoteClick(null)
            }}
            className={classes.fab}
          >
            <AddIcon />
          </Fab>

          <DeleteDialog
            showDialog={showDeleteDialog}
            handleDelete={handleDelete}
            handleDeleteDialogClose={handleDeleteDialogClose}
            dialogTitle='Delete note?'
            dialogContent='Are you certain that you want to delete the note?'
          />
        </div>
      )
    }
  }
  return (
    <>
      <Grid container className={classes.container} justify='center'>
        <Grid item>
          <SearchField
            handleSubmit={execFiltering}
            searchTerm={searchTerm}
            handleSearchTermChange={handleSearchTermChange}
            handleSearchAll={handleSearchAll}
          />
        </Grid>
        <Grid container spacing={1} direction='column' alignItems='center'>
          <p>No stored notes found.</p>
          <br />
          <br />
          <Grid
            container
            spacing={2}
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Grid item>
              <div ref={noteFormRef} />
              <NoteForm
                client={client}
                note={null}
                visible={editNoteVisible}
                handleFormVisibility={handleFormVisibility}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />
            </Grid>
          </Grid>
          <Fab
            id='add_note_button'
            color='primary'
            aria-label='Add note'
            onClick={note => {
              handleEditNoteClick(null)
            }}
            className={classes.fab}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
    </>
  )
}
export default NotesPage
