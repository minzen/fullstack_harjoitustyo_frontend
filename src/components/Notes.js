import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { Grid, makeStyles, Fab, TextField } from '@material-ui/core'
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

const NOTE_KEYWORDS = gql`
  query {
    allKeywordsInNotesOfUser
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
  const [allKeywords, setAllKeywords] = useState([])
  const [filteredNotes, setFilteredNotes] = useState(null)
  let allNotes

  const fetchKeywords = async () => {
    try {
      const { data, loading, error } = await client.query({
        query: NOTE_KEYWORDS
      })
      if (data) {
        console.log(data.allKeywordsInNotesOfUser)
        return data.allKeywordsInNotesOfUser
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setAllKeywords(fetchKeywords())
    console.log(allKeywords)
  }, [])

  if (!show) {
    return null
  }
  if (result && result.loading) {
    return <div>loading...</div>
  }
  allNotes = result.data.allNotes
  if (!filteredNotes) setFilteredNotes(allNotes)

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
    // await setAllKeywords(fetchKeywords())
    // console.log('Value of allKeywords', allKeywords)
    setSearchTerm(event.target.value)
    // Filter the notes by the provided search term
    if (searchTerm === '' || searchTerm === null) {
      setFilteredNotes(allNotes)
    } else {
      setFilteredNotes(
        filteredNotes.filter(n => {
          const noteKeywords = n.keywords.join(',')
          console.log(noteKeywords)
          if (noteKeywords.includes(searchTerm)) {
            return true
          }
          return false
        })
      )
    }
    console.log('filteredNotes:', filteredNotes)
  }

  if (filteredNotes && filteredNotes.length > 0) {
    return (
      <Grid container justify='center'>
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
