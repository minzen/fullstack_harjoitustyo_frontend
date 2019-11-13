import React, { Component, useState } from 'react'
import { gql } from 'apollo-boost'
import { Query, Mutation } from 'react-apollo'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography
} from '@material-ui/core'
// import Note from './Note'
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

const Notes = ({ show, client }) => {
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

  if (notes) {
    console.log('Notes to be printed out', notes)
    return (
      <div>
        <h2>Stored Notes</h2>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} direction='row' alignItems='center'>
              {notes.map(note => {
                return (
                  <Card key={note.id}>
                    <CardHeader title={note.title} />
                    <CardContent>
                      <Typography variant='body1' gutterBottom>
                        {note.content}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              })}
            </Grid>
          </Grid>
        </Grid>

        {/* <Note show={true} note={selectedNote} client={client} /> */}
        <AddNote />
      </div>
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
