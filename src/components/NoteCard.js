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
import { useTranslation } from 'react-i18next'

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
    marginLeft: 5,
    marginTop: 15
  },
  cardContent: {
    color: '#d7e6e8'
  },
  cardContentHeader: {
    color: 'lightblue'
  }
})

const NoteCard = ({ note, handleEditNoteClick, handleDeleteNoteClick }) => {
  const classes = useStyles()
  const { t } = useTranslation()

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
        <Grid container>
          <Grid item>
            <Typography
              variant='body1'
              gutterBottom
              className={classes.cardContentHeader}
            >
              {t('Note')}&nbsp;
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              data-cy='contentField'
              variant='body1'
              gutterBottom
              className={classes.cardContent}
            >
              {note.content}
            </Typography>
          </Grid>
        </Grid>
        <LinkField link={link} />
        <Grid container>
          <Grid item>
            <Typography
              variant='body1'
              gutterBottom
              className={classes.cardContentHeader}
            >
              {t('Keywords')}&nbsp;
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              data-cy='keywordsField'
              variant='body1'
              gutterBottom
              className={classes.cardContent}
            >
              {extractKeywordsFromArrayWithJoin(note.keywords)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} direction='row'>
          <Grid item>
            <Button
              data-cy='editSubmit'
              startIcon={<EditIcon />}
              variant='contained'
              color='primary'
              onClick={() => {
                handleEditNoteClick(note)
              }}
            >
              {t('Edit')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-cy='deleteSubmit'
              startIcon={<DeleteOutlinedIcon />}
              variant='contained'
              color='secondary'
              onClick={() => {
                handleDeleteNoteClick(note)
              }}
            >
              {t('Delete')}
            </Button>
          </Grid>
          <Grid container spacing={1} direction='column'>
            <Typography
              data-cy='timestampField'
              variant='body2'
              gutterBottom
              className={classes.timestamp}
            >
              <Timestamp timestamp={note.modified} />
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
export default NoteCard
