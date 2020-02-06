import React from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Container
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import notesImg from '../../assets/notes_overview.png'
import filteringImg from '../../assets/filtering.png'
import addNoteImg from '../../assets/add_note.png'
import registerImg from '../../assets/register.png'
import personalDataImg from '../../assets/edit_personal_data.png'
import changePasswordImg from '../../assets/change_password.png'

const useStyles = makeStyles({
  cardContainer: {
    justifyContent: 'center'
  },
  image: {
    height: '100%'
  }
})

const AboutPage = ({ show }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  if (!show) {
    return null
  }

  return (
    <>
      <Container maxWidth='xl'>
        <Card className={classes.card}>
          <CardHeader title={t('About')} />{' '}
          <CardContent>
            <h3>{t('General')}</h3>
            <p>
              {t('')}
              {t('Application description')}
            </p>
            <h3>{t('Registration')}</h3>
            <p>{t('User account needed')}</p>
            <CardMedia className={classes.image} title={t('Register')}>
              <img src={registerImg} alt={t('Registration')} />
            </CardMedia>

            <h3>{t('Notes overview')}</h3>
            <p>{t('Handling notes')}</p>
            <CardMedia className={classes.image} title={t('Notes overview')}>
              <img src={notesImg} alt={t('Notes overview')} />
            </CardMedia>

            <h3>{t('Adding a note')}</h3>
            <p>{t('Instructions for adding a note')}</p>
            <CardMedia className={classes.image} title={t('Add note')}>
              <img src={addNoteImg} alt={t('Add note')} />
            </CardMedia>

            <h3>{t('Search for notes')}</h3>
            <p>{t('Keyword search')}</p>
            <CardMedia className={classes.image} title={t('Filtering')}>
              <img src={filteringImg} alt={t('Filtering')} />
            </CardMedia>

            <h3>{t('Managing your profile')}</h3>
            <p>{t('Profile management')}</p>
            <Grid
              container
              spacing={2}
              direction='row'
              justify='center'
              alignItems='center'
            >
              <Grid item>
                <CardMedia
                  className={classes.image}
                  title={t('Edit personal data')}
                >
                  <img src={personalDataImg} alt={t('Edit personal data')} />
                </CardMedia>
              </Grid>
              <Grid item>
                <CardMedia
                  className={classes.image}
                  title={t('Change password')}
                >
                  <img src={changePasswordImg} alt={t('Change password')} />
                </CardMedia>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
export default AboutPage
