import React from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardMedia
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import notesImg from '../assets/notes_overview.png'
import filteringImg from '../assets/filtering.png'
import addNoteImg from '../assets/add_note.png'
import registerImg from '../assets/register.png'

const useStyle = makeStyles({
  cardContainer: {
    justifyContent: 'center'
  },
  image: {
    height: '100%'
  }
})

const About = ({ show }) => {
  const classes = useStyle()
  if (!show) {
    return null
  }

  return (
    <>
      <Grid container className={classes.cardContainer}>
        <Card className={classes.card}>
          <CardHeader title='Memory Tracks' />{' '}
          <CardContent>
            <h3>General</h3>
            <p>
              The application enables storing of "memory tracks", i.e. relevant
              notes, links etc. to be searched and obtained later when needed.
            </p>
            <h3>Registration</h3>
            <p>
              You will need a user account to be able to manage notes on the
              system. On the image below you'll find the registration component
              where you have to fill in at least an email address that is used
              as your username as well as a password.
            </p>
            <CardMedia className={classes.image} title='Register'>
              <img src={registerImg} alt='Registration' />
            </CardMedia>

            <h3>Notes overview</h3>
            <p>
              Basically you may maintain notes with a title, description and a
              set of keywords in the system. Those are stored to a MongoDB
              database and fetched through an API to be viewed on the frontend.
              Moreover, the conventional options to edit or remove existing
              notes are included. See the screenshot below
            </p>
            <CardMedia className={classes.image} title='Notes Overview'>
              <img src={notesImg} alt='Notes Overview' />
            </CardMedia>
            <h3>Adding a note</h3>
            <p>
              You will have to provide at least a title and some content to a
              note. It is also recommended to add some keywords as well to
              enable the search for notes by keywords.
            </p>
            <CardMedia className={classes.image} title='Add note'>
              <img src={addNoteImg} alt='add a note' />
            </CardMedia>

            <h3>Search for notes</h3>
            <p>
              There is a keyword search functionality on the main page with
              which one may search notes by their keywords. Type in a keyword
              and click the button to execute filtering of the content.
            </p>
            <CardMedia className={classes.image} title='Filtering'>
              <img src={filteringImg} alt='Filtering' />
            </CardMedia>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}
export default About
