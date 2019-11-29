import React, { useState, useRef } from 'react'
import { gql } from 'apollo-boost'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import NoteForm from './NoteForm'
import DeleteDialog from './DeleteDialog'
import Note from './Note'
import FilterField from './FilterField'
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
  const [showAll, setShowAll] = useState(true)

  const noteFormRef = useRef(null)
  const scrollToNoteForm = () => scrollToRef(noteFormRef)

  if (!show) {
    return null
  }

  if (result && result.loading) {
    return <div>loading...</div>
  }
  let notes = []
  if (result.data.allNotes) {
    notes = result.data.allNotes
  }

  // Filters the notes based on a keyword
  // Parameter: an array of notes
  // Return value: an array of notes filtered by the keyword or an empty array
  const execKeywordFiltering = notes => {
    let filteredNotes = []
    if (notes) {
      notes.forEach(note => {
        const keywords = note.keywords
        if (keywords) {
          // console.log(keywords)
          keywords.forEach(element => {
            if (
              element.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !filteredNotes.includes(note)
            ) {
              filteredNotes.push(note)
            }
          })
        }
      })
    }
    return filteredNotes
  }

  const notesToShow = showAll ? notes : execKeywordFiltering(notes)

  const rows = () =>
    notesToShow.map(note => {
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
    })

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false)
  }

  const handleDeleteDialogOpen = () => {
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    // console.log('handleDelete', selectedNote.id)
    handleSpinnerVisibility(true)

    try {
      const { data, loading, error } = await client.mutate({
        mutation: DELETE_NOTE,
        variables: {
          id: selectedNote.id
        },
        refetchQueries: [{ query: ALL_NOTES }]
      })
      if (!loading && !error) {
        if (data) {
          handleSpinnerVisibility(false)
          // console.log('Response data of deleteNote', data)
          setSelectedNote(null)
        }
      }
    } catch (e) {
      console.log('error when deleting a note', e)
      handleSpinnerVisibility(false)
    }
  }

  const handleSearchTermChange = async event => {
    // console.log('Current search term', event.target.value)
    handleSpinnerVisibility(true)
    await setSearchTerm(event.target.value)
    if (searchTerm && searchTerm !== '') {
      setShowAll(false)
    } else {
      setShowAll(true)
    }
    handleSpinnerVisibility(false)
  }

  const handleEditNoteClick = async note => {
    await setEditNoteVisible(true)
    await setSelectedNote(note)
    console.log('handleEditNoteClick()', note)
    if (note !== null) {
      await scrollToNoteForm()
    }
  }

  const handleDeleteNoteClick = async note => {
    await setEditNoteVisible(false)
    await setSelectedNote(note)
    await scrollToNoteForm()
    await handleDeleteDialogOpen()
  }

  const handleFormVisibility = async value => {
    if (value) {
      setEditNoteVisible(true)
    } else {
      setEditNoteVisible(false)
    }
  }
  //console.log('rows', rows())
  if (rows().length === 0) {
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='center'
          alignItems='center'
        >
          <FilterField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchTermChange={handleSearchTermChange}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
        >
          <Grid item>
            <h3>No stored notes found.</h3>
          </Grid>
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

          <Grid item>
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
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='center'
          alignItems='center'
        >
          <FilterField
            searchTerm={searchTerm}
            handleSearchTermChange={handleSearchTermChange}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
        >
          {rows()}
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
          <Grid item>
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
export default NotesPage
