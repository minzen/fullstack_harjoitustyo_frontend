import React, { useState, useRef } from 'react'
import { gql } from 'apollo-boost'
import { Grid } from '@material-ui/core'
import NoteForm from '../forms/NoteForm'
import DeleteDialog from '../dialogs/DeleteDialog'
import NoteCard from '../cards/NoteCard'
import FilterField from '../fieldcomponents/FilterField'
import AddNoteButton from '../fieldcomponents/AddNoteButton'
import { useTranslation } from 'react-i18next'
import ArchiveDialog from '../dialogs/ArchiveDialog'

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

const NOT_ARCHIVED_NOTES = gql`
  query {
    notArchivedNotes {
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

const ARCHIVE_NOTE = gql`
  mutation archiveNote($id: ID!) {
    archiveNote(id: $id)
  }
`

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

const NotesPage = ({ show, client, result, handleSpinnerVisibility }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [editNoteVisible, setEditNoteVisible] = useState(false)
  const [showAll, setShowAll] = useState(true)
  const noteFormRef = useRef(null)
  const scrollToNoteForm = () => scrollToRef(noteFormRef)
  const { t } = useTranslation()

  if (!show) {
    console.log('not showing the notespage')
    return null
  }

  if (result && result.loading) {
    return <div>loading...</div>
  }
  let notes = []
  if (result.data.notArchivedNotes) {
    notes = result.data.notArchivedNotes
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
          <NoteCard
            note={note}
            handleArchiveNoteClick={() => {
              return handleArchiveNoteClick(note)
            }}
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

  const handleArchiveDialogOpen = () => {
    setShowArchiveDialog(true)
  }

  const handleArchiveDialogClose = () => {
    setShowArchiveDialog(false)
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
        refetchQueries: [{ query: NOT_ARCHIVED_NOTES }]
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

  const handleArchive = async () => {
    console.log('handleArchive', selectedNote.id)
    handleSpinnerVisibility(true)

    try {
      const { data, loading, error } = await client.mutate({
        mutation: ARCHIVE_NOTE,
        variables: {
          id: selectedNote.id
        },
        refetchQueries: [{ query: NOT_ARCHIVED_NOTES }]
      })
      if (!loading && !error) {
        if (data) {
          handleSpinnerVisibility(false)
          console.log('Response data of archiveNote', data)
          setSelectedNote(null)
        }
      }
    } catch (e) {
      console.log('error when archiving a note', e)
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
    await scrollToNoteForm()
  }

  const handleDeleteNoteClick = async note => {
    await setEditNoteVisible(false)
    await setSelectedNote(note)
    await scrollToNoteForm()
    await handleDeleteDialogOpen()
  }

  const handleArchiveNoteClick = async note => {
    await setEditNoteVisible(false)
    await setSelectedNote(note)
    console.log('handleArchiveNoteClick()', note)
    await handleArchiveDialogOpen()
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
      <>
        <Grid
          container
          spacing={2}
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Grid item style={{ padding: '12px' }}>
            <FilterField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearchTermChange={handleSearchTermChange}
            />
            <Grid item></Grid>
            <h3>{t('No stored notes found.')}</h3>
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
        </Grid>
        <AddNoteButton handleEditNoteClick={handleEditNoteClick} />
      </>
    )
  } else {
    return (
      <>
        <Grid
          container
          spacing={2}
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Grid item style={{ padding: '12px' }}>
            <FilterField
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          justify='center'
          spacing={8}
          style={{ padding: '18px' }}
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
                handleEditNoteClick(selectedNote)
              }}
              handleSpinnerVisibility={handleSpinnerVisibility}
            />
          </Grid>
        </Grid>
        <AddNoteButton handleEditNoteClick={handleEditNoteClick} />
        <DeleteDialog
          showDialog={showDeleteDialog}
          handleDelete={handleDelete}
          handleDeleteDialogClose={handleDeleteDialogClose}
          dialogTitle={t('Delete note?')}
          dialogContent={t('Are you certain that you want to delete the note?')}
          dialogConfirmationText={t('Delete')}
        />
        <ArchiveDialog
          showDialog={showArchiveDialog}
          handleAction={handleArchive}
          handleDialogClose={handleArchiveDialogClose}
          dialogTitle={t('Archive note?')}
          dialogContent={t(
            'Are you certain that you want to archive the selected note?'
          )}
          dialogConfirmationText={t('Archive')}
        />
      </>
    )
  }
}
export default NotesPage
