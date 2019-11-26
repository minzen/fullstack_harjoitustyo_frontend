import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { Grid, makeStyles, Fab, TextField, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import NoteForm from './NoteForm'
import DeleteDialog from './DeleteDialog'
import Note from './Note'

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
  container: {
    minWidth: 400
  }
})

const Notes = ({ show, client, result, handleSpinnerVisibility }) => {
  const classes = useStyles()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editNoteVisible, setEditNoteVisible] = useState(false)
  const [filteredNotes, setFilteredNotes] = useState(null)
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

  if (filteredNotes) {
    return (
      <Grid container justify='center'>
        <Grid item>Filtered notes: {filteredNotes.length}</Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} direction='column' alignItems='center'>
            <Grid item>
              <TextField
                id='search_field'
                variant='filled'
                label='Search by keyword: '
                onChange={handleSearchTermChange}
                value={searchTerm}
                className={classes.textField}
              />
            </Grid>
            <Grid item>
              <Button
                onClick={execFiltering}
                color='secondary'
                variant='contained'
              >
                Filter
              </Button>
            </Grid>
            <Grid item>
              {filteredNotes.map(note => {
                return (
                  <Note
                    note={note}
                    setSelectedNote={setSelectedNote}
                    setEditNoteVisible={setEditNoteVisible}
                    handleDeleteDialogOpen={handleDeleteDialogOpen}
                  />
                )
              })}
            </Grid>
            <Fab
              id='add_note_button'
              color='primary'
              aria-label='Add note'
              onClick={() => {
                setEditNoteVisible(true)
                setSelectedNote(null)
              }}
              className={classes.addButton}
            >
              <AddIcon />
            </Fab>

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
          <Grid item>Notes: {notes.length}</Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} direction='column' alignItems='center'>
              <Grid item>
                <TextField
                  id='search_field'
                  variant='filled'
                  label='Search by keyword: '
                  onChange={handleSearchTermChange}
                  value={searchTerm}
                  className={classes.textField}
                />
              </Grid>
              <Grid item>
                <Button
                  onClick={execFiltering}
                  color='secondary'
                  variant='contained'
                >
                  Filter
                </Button>
              </Grid>

              <Grid item>
                {notes.map(note => {
                  return (
                    <Note
                      note={note}
                      setSelectedNote={setSelectedNote}
                      setEditNoteVisible={setEditNoteVisible}
                      handleDeleteDialogOpen={handleDeleteDialogOpen}
                    />
                  )
                })}
              </Grid>
              <Fab
                id='add_note_button'
                color='primary'
                aria-label='Add note'
                onClick={() => {
                  setEditNoteVisible(true)
                  setSelectedNote(null)
                }}
                className={classes.addButton}
              >
                <AddIcon />
              </Fab>

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
        <Grid item>
          <TextField
            id='search_field'
            variant='filled'
            label='Search by keyword: '
            onChange={handleSearchTermChange}
            value={searchTerm}
            className={classes.textField}
          />
        </Grid>
        <Grid container spacing={1} direction='column' alignItems='center'>
          <p>No stored notes found.</p>
          <br />
          <br />
          <Fab
            id='add_note_button'
            color='primary'
            aria-label='Add note'
            onClick={() => {
              setEditNoteVisible(true)
            }}
            className={classes.addButton}
          >
            <AddIcon />
          </Fab>

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
