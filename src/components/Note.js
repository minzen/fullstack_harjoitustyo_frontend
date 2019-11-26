import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import Timestamp from './Timestamp'
import LinkField from './LinkField'

const useStyles = makeStyles({
  container: {
    minWidth: 400
  },
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

const Note = ({
  note,
  setSelectedNote,
  setEditNoteVisible,
  handleDeleteDialogOpen
}) => {
  const classes = useStyles()

  const extractKeywordsFromArrayWithJoin = keywords => {
    console.log('keywords :', keywords)
    if (!keywords) {
      return ''
    }
    return keywords.join()
  }

  const detectLinkFromText = text => {
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
  const link = detectLinkFromText(note.content)

  return (
    <Card className={classes.card} key={note.id}>
      <CardHeader
        title={note.title}
        className={classes.cardHeader}
      ></CardHeader>

      <CardContent>
        <Typography data-cy='contentField' variant='body1' gutterBottom>
          Note: {note.content}
        </Typography>
        <LinkField link={link} />
        <Typography data-cy='keywordsField' variant='body1' gutterBottom>
          Keywords: {extractKeywordsFromArrayWithJoin(note.keywords)}
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
}
export default Note
