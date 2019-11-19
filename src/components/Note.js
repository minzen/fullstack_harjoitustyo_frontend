import React from 'react'
import { Grid } from '@material-ui/core'

const Note = ({ client, note }) => {
  if (note) {
    console.log(note)
    const keywords = note.keywords.join()
    return (
      <>
        <Grid>
          <h1 style={{ fontWeight: 'bold' }}>{note.title}</h1>
          <p>{note.content}</p>
          <p>{keywords}</p>
        </Grid>
      </>
    )
  }
  return null
}
export default Note
