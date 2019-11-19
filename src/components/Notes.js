import React, { useState, useEffect } from 'react'
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
  DialogTitle
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import Note from './Note'
import AddNote from './AddNote'

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
  }
})

const Notes = ({ show, client }) => {
  const classes = useStyles()
  // TODO: Implement search
  const [searchTerm, setSearchTerm] = useState('')
  const [notes, setNotes] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const getNotes = async () => {
    console.log('Obtaining notes...')
    const { data } = await client.query({
      query: ALL_NOTES
    })
    console.log('response of allNotes', data.allNotes)
    await setNotes(data.allNotes)
  }

  useEffect(() => {
    getNotes()
  })

  if (!show) {
    return null
  }

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false)
  }

  const handleDeleteDialogOpen = () => {
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    console.log('handleDelete', selectedNote.id)
    try {
      const { data, loading, error } = await client.mutate({
        mutation: DELETE_NOTE,
        variables: {
          id: selectedNote.id
        },
        // TODO: Does not work yet
        refetchQueries: ['allNotes']
      })
      if (data) {
        console.log('Response data of deleteNote', data)
      }
    } catch (e) {
      console.log('error when deleting a note', e)
    }
  }

  function extractKeywordsFromArrayWithJoin(keywords) {
    console.log('keywords :', keywords)
    if (!keywords) {
      return ''
    }
    return keywords.join()
  }

  // TODO: Create a link of a suitable string automatically

  if (notes) {
    console.log('Notes to be printed out', notes)
    return (
      <>
        <Grid container justify='center'>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} direction='row' alignItems='center'>
              {notes.map(note => {
                return (
                  <Card
                    className={classes.card}
                    key={note.id}
                    // onClick={() => {
                    //   console.log('card clicked', note.id)
                    //   setSelectedNote(note)
                    // }}
                  >
                    <CardHeader
                      title={note.title}
                      className={classes.cardHeader}
                      onClick={() => {
                        console.log('cardheader clicked', note.id)
                      }}
                    ></CardHeader>

                    <CardContent>
                      <Typography variant='body1' gutterBottom>
                        {note.content}
                      </Typography>
                      <Typography variant='body1' gutterBottom>
                        Keywords:{' '}
                        {extractKeywordsFromArrayWithJoin(note.keywords)}
                      </Typography>
                    </CardContent>

                    <CardContent>
                      <Button
                        startIcon={<EditIcon />}
                        variant='contained'
                        onClick={() => {
                          console.log('editIcon clicked')
                          setSelectedNote(note)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteOutlinedIcon />}
                        variant='contained'
                        onClick={() => {
                          console.log('delete note clicked')
                          setSelectedNote(note)
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
            <AddNote client={client} />
            <Note note={selectedNote} />

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
                  onClick={handleDeleteDialogClose}
                  color='default'
                  variant='contained'
                >
                  Cancel
                </Button>
                <Button
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
      </>
    )
  }

  return (
    <>
      <h2>Stored Notes</h2>
      <p>No stored notes found.</p>
      <br />
      <br />
      <AddNote client={client} />
    </>
  )
}
export default Notes
