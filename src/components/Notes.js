import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [notes, setNotes] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const maxLength = 40

  if (!show) {
    return null
  }

  const handleTextChange = search => {
    console.log(`Setting ${search} to the search term`)
    setSearchTerm(search)
  }

  const handleNewNote = () => {
    console.log('Create a new note event')
  }

  const handleNotePress = note => {
    console.log('Press on a list item', note.id)
    setSelectedNote(note)
  }

  const handleNoteLongPress = id => {
    console.log('Long Press on a list item', id)
  }

  const getNotes = async () => {
    console.log('Obtaining notes...')
    const { data } = await client.query({
      query: ALL_NOTES
    })
    console.log('response of allNotes', data.allNotes)
    await setNotes(data.allNotes)
  }
  getNotes()

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
                    onClick={() => {
                      console.log('card clicked', note.id)
                      setSelectedNote(note)
                    }}
                  >
                    <CardHeader
                      title={note.title}
                      className={classes.cardHeader}
                      onClick={() => {
                        console.log('cardheader clicked', note.id)
                      }}
                      action={
                        <EditIcon
                          onClick={() => {
                            console.log('editIcon clicked')
                          }}
                        />
                      }
                    />
                    <CardContent>
                      <Typography variant='body1' gutterBottom>
                        {note.content}
                      </Typography>
                      <Typography variant='body1' gutterBottom>
                        Keywords:{' '}
                        {extractKeywordsFromArrayWithJoin(note.keywords)}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              })}
            </Grid>
            <AddNote />
            <Note view={true} note={selectedNote} />
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <h2>Stored Notes</h2>
      <p>No stored notes found.</p>
    </>
  )
}
export default Notes
