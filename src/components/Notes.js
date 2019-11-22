import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  makeStyles,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Fab,
  Link
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import AddIcon from '@material-ui/icons/Add'
import NoteForm from './NoteForm'
import Timestamp from './Timestamp'
import LinkField from './LinkField'
import { isTSExpressionWithTypeArguments } from '@babel/types'

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
  card: {
    minWidth: 275,
    maxWidth: 345,
    backgroundColor: '#EEF0F1',
    marginTop: 15,
    marginRight: 10
  },
  cardHeader: {
    backgroundColor: '#CCCCCC',
    padding: 2
  },
  timestamp: {
    marginTop: 10,
    color: '#708090'
  }
})

const Notes = ({ show, client, result, handleSpinnerVisibility }) => {
  const classes = useStyles()
  // TODO: Implement search
  //const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editNoteVisible, setEditNoteVisible] = useState(false)

  let notes

  if (!show) {
    return null
  }

  if (result && result.loading) {
    return <div>loading...</div>
  } else {
    notes = result.data.allNotes
  }

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

  const extractKeywordsFromArrayWithJoin = keywords => {
    console.log('keywords :', keywords)
    if (!keywords) {
      return ''
    }
    return keywords.join()
  }

  const detectLinkFromText = text => {
    console.log(
      'Attempting to construct a link based on the text content...',
      text
    )
    let tokenizedByBlanks
    if (text.split(' ') === null) {
      tokenizedByBlanks = [text]
    } else {
      tokenizedByBlanks = text.split(' ')
    }
    let link
    tokenizedByBlanks.forEach(element => {
      let res = element.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
      )
      if (res !== null) {
        link = res
        return
      }
    })
    return link
  }

  if (notes && notes.length > 0) {
    return (
      <Grid container justify='center'>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} direction='row' alignItems='center'>
            {notes.map(note => {
              const link = detectLinkFromText(note.content)
              return (
                <Card className={classes.card} key={note.id}>
                  <CardHeader
                    title={note.title}
                    className={classes.cardHeader}
                  ></CardHeader>

                  <CardContent>
                    <Typography
                      data-cy='contentField'
                      variant='body1'
                      gutterBottom
                    >
                      Note: {note.content}
                    </Typography>
                    <LinkField link={link} />
                    <Typography
                      data-cy='keywordsField'
                      variant='body1'
                      gutterBottom
                    >
                      Keywords:{' '}
                      {extractKeywordsFromArrayWithJoin(note.keywords)}
                    </Typography>
                    <Typography
                      className={classes.timestamp}
                      data-cy='timestampField'
                      variant='body2'
                      gutterBottom
                    >
                      <Timestamp timestamp={note.modified} />
                    </Typography>
                  </CardContent>

                  <CardContent>
                    <Button
                      data-cy='editSubmit'
                      startIcon={<EditIcon />}
                      variant='contained'
                      onClick={() => {
                        console.log('editIcon clicked')
                        setSelectedNote(note)
                        setEditNoteVisible(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      data-cy='deleteSubmit'
                      startIcon={<DeleteOutlinedIcon />}
                      variant='contained'
                      onClick={() => {
                        console.log('delete note clicked')
                        setSelectedNote(note)
                        setEditNoteVisible(false)
                        handleDeleteDialogOpen()
                      }}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
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

          <Dialog
            open={showDeleteDialog}
            onClose={handleDeleteDialogClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Delete note?</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Are you certain that you want to delete the note?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                data-cy='cancelConfirmation'
                onClick={handleDeleteDialogClose}
                color='default'
                variant='contained'
              >
                Cancel
              </Button>
              <Button
                data-cy='submitConfirmation'
                onClick={() => {
                  handleDeleteDialogClose()
                  handleDelete()
                }}
                color='secondary'
                autoFocus
                variant='contained'
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <h2>Stored Notes</h2>
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
    </>
  )
}
export default Notes
