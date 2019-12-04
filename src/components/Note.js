import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Grid
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import Timestamp from './fieldcomponents/Timestamp'
import LinkField from './fieldcomponents/LinkField'

const useStyles = makeStyles({
  card: {
    backgroundColor: '#718792',
    margin: 5
  },
  cardHeader: {
    backgroundColor: '#1c313a',
    padding: 5,
    margin: 5
  },
  timestamp: {
    color: 'lightblue',
    marginTop: 10
  },
  cardContent: {
    color: 'lightblue'
  }
})

const Note = ({ note, handleEditNoteClick, handleDeleteNoteClick }) => {
  const classes = useStyles()

  const extractKeywordsFromArrayWithJoin = keywords => {
    // console.log('keywords :', keywords)
    if (!keywords) {
      return ''
    }
    return keywords.join()
  }

  const detectLinkFromText = text => {
    let tokenizedByBlanks
    let link
    if (text.split(' ') === null) {
      tokenizedByBlanks = [text]
    } else {
      tokenizedByBlanks = text.split(' ')
    }
    if (tokenizedByBlanks) {
      tokenizedByBlanks.forEach(element => {
        let res = element.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
        )
        if (res !== null) {
          link = res
          return
        }
      })
    }

    return link
  }
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
          className={classes.cardContent}
        >
          Note: {note.content}
        </Typography>
        <LinkField link={link} />
        <Typography
          data-cy='keywordsField'
          variant='body1'
          gutterBottom
          className={classes.cardContent}
        >
          Keywords: {extractKeywordsFromArrayWithJoin(note.keywords)}
        </Typography>

        <Grid container spacing={1} direction='row'>
          <Grid item>
            <Button
              data-cy='editSubmit'
              startIcon={<EditIcon />}
              variant='contained'
              color='primary'
              onClick={() => {
                //   console.log('edit note clicked')
                return handleEditNoteClick(note)
              }}
            >
              Edit
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-cy='deleteSubmit'
              startIcon={<DeleteOutlinedIcon />}
              variant='contained'
              color='secondary'
              onClick={() => {
                // console.log('delete note clicked')
                return handleDeleteNoteClick(note)
              }}
            >
              Delete
            </Button>
          </Grid>
          <Typography
            data-cy='timestampField'
            variant='body2'
            gutterBottom
            className={classes.timestamp}
          >
            <Timestamp timestamp={note.modified} />
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  )
}
export default Note
