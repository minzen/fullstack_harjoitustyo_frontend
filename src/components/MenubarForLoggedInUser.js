import React from 'react'
import { ButtonGroup, Button, Grid } from '@material-ui/core'
import MemoryIcon from '@material-ui/icons/Memory'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import InfoIcon from '@material-ui/icons/Info'
import {
  PROFILE_PAGE,
  ABOUT_PAGE,
  NOTES_PAGE,
  LOGIN_PAGE
} from '../constants/pages'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './fieldcomponents/LanguageSelector'
import AvatarField from './fieldcomponents/AvatarField'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import Loading from './general/Loading'

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    email
    givenname
    surname
  }
`

const CURRENT_USER = gql`
  query {
    me {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

const MenubarForLoggedInUser = ({ setPage, setToken, client }) => {
  const { t } = useTranslation()
  let loggedInUser

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    client.resetStore()
    setPage(LOGIN_PAGE)
  }

  const handleAboutClick = () => {
    setPage(ABOUT_PAGE)
  }

  const handleNotesClick = () => {
    setPage(NOTES_PAGE)
  }

  const handleProfileClick = () => {
    setPage(PROFILE_PAGE)
  }

  const { loading, data } = useQuery(CURRENT_USER)
  if (loading) {
    return <Loading />
  }

  if (data && data.me) {
    loggedInUser = data.me
  }

  return (
    <Grid container spacing={2} justify='center' alignItems='center'>
      <Grid item style={{ padding: '12px' }}>
        <ButtonGroup
          variant='contained'
          color='primary'
          size='large'
          aria-label='large contained primary button group'
        >
          <Button
            id='menu_profile_button'
            data-cy='menuProfileBtn'
            onClick={handleProfileClick}
          >
            <AvatarField loggedInUser={loggedInUser} />
          </Button>
          <Button id='menu_notes_button' onClick={handleNotesClick}>
            {t('Memory Tracks')}&nbsp;
            <MemoryIcon />
          </Button>
          <Button id='menu_about_button' onClick={handleAboutClick}>
            {t('About')}&nbsp;
            <InfoIcon />
          </Button>
          <Button id='menu_logout_button' onClick={handleLogout}>
            {t('Logout')}&nbsp;
            <ExitToAppIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <LanguageSelector />
      </Grid>
    </Grid>
  )
}
export default MenubarForLoggedInUser
