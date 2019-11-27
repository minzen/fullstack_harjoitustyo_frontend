import React, { useState, useRef } from 'react'
import { gql } from 'apollo-boost'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import NoteForm from './NoteForm'
import DeleteDialog from './DeleteDialog'
import Note from './Note'
import SearchField from './SearchField'

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
  textField: {
    width: 240
  }
})

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

const Notes = ({ show, client, result, handleSpinnerVisibility }) => {
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
    if (!keyword || keyword.trim() === '') {
      setFilteredNotes(null)
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
    } catch (e) {
      console.log(e)
    }
  }

  const handleAddNewNoteClick = async () => {
    await setEditNoteVisible(true)
    await setSelectedNote(null)
    await scrollToNoteForm()
  }

  const handleEditNoteClick = async note => {
    await setEditNoteVisible(true)
    await setSelectedNote(note)
    await scrollToNoteForm()
  }

  const handleDeleteNoteClick = async note => {
    await setEditNoteVisible(true)
    await setSelectedNote(note)
    await scrollToNoteForm()
    await handleDeleteDialogOpen()
  }

  if (filteredNotes) {
    return (
      <Grid container justify='center'>
        {/* <Grid item>Filtered notes: {filteredNotes.length}</Grid> */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} direction='column' alignItems='center'>
            <SearchField
              handleSubmit={execFiltering}
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
            />
            <Grid item>
              {filteredNotes.map(note => {
                return (
                  <Note
                    note={note}
                    handleEditNoteClick={handleEditNoteClick}
                    handleDeleteNoteClick={handleDeleteNoteClick}
                  />
                )
              })}
            </Grid>
            <Fab
              id='add_note_button'
              color='primary'
              aria-label='Add note'
              onClick={event => {
                handleAddNewNoteClick(event)
              }}
              className={classes.addButton}
            >
              <AddIcon />
            </Fab>

            <div ref={noteFormRef} />
            <NoteForm
              client={client}
              note={selectedNote}
              visible={editNoteVisible}
              handleSpinnerVisibility={handleSpinnerVisibility}
            />

            <DeleteDialog
              showDialog={showDeleteDialog}
              handleDelete={handleDelete}
              handleDeleteDialogClose={handleDeleteDialogClose}
              dialogTitle='Delete note?'
              dialogContent='Are you certain that you want to delete the note?'
            />
          </Grid>
        </Grid>
      </Grid>
    )
  } else {
    if (notes) {
      return (
        <Grid container justify='center'>
          {/* <Grid item>Notes: {notes.length}</Grid> */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} direction='column' alignItems='center'>
              <SearchField
                handleSubmit={execFiltering}
                searchTerm={searchTerm}
                handleSearchTermChange={handleSearchTermChange}
              />
              <Grid item>
                {notes.map(note => {
                  return (
                    <Note
                      key={note.id}
                      note={note}
                      handleEditNoteClick={handleEditNoteClick}
                      handleDeleteNoteClick={handleDeleteNoteClick}
                    />
                  )
                })}
              </Grid>
              <Fab
                id='add_note_button'
                color='primary'
                aria-label='Add note'
                onClick={handleAddNewNoteClick}
                className={classes.addButton}
              >
                <AddIcon />
              </Fab>

              <div ref={noteFormRef} />
              <NoteForm
                client={client}
                note={selectedNote}
                visible={editNoteVisible}
                handleSpinnerVisibility={handleSpinnerVisibility}
              />

              <DeleteDialog
                showDialog={showDeleteDialog}
                handleDelete={handleDelete}
                handleDeleteDialogClose={handleDeleteDialogClose}
                dialogTitle='Delete note?'
                dialogContent='Are you certain that you want to delete the note?'
              />
            </Grid>
          </Grid>
        </Grid>
      )
    }
  }
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
        />
        <Grid container spacing={1} direction='column' alignItems='center'>
          <p>No stored notes found.</p>
          <br />
          <br />
          <Fab
            id='add_note_button'
            color='primary'
            aria-label='Add note'
            onClick={event => {
              handleAddNewNoteClick(event)
            }}
            className={classes.addButton}
          >
            <AddIcon />
          </Fab>

          <div ref={noteFormRef} />
          <NoteForm
            client={client}
            note={null}
            visible={editNoteVisible}
            handleSpinnerVisibility={handleSpinnerVisibility}
          />
        </Grid>
      </Grid>
    </>
  )
}
export default Notes
