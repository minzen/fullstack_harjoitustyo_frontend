import React from 'react'
import { ButtonGroup, Button, Grid } from '@material-ui/core'
import MemoryIcon from '@material-ui/icons/Memory'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import InfoIcon from '@material-ui/icons/Info'
import { PROFILE_PAGE, ABOUT_PAGE, NOTES_PAGE } from '../constants/pages'
import AvatarField from '../components/fieldcomponents/AvatarField'
import { useTranslation } from 'react-i18next'
const MenubarForLoggedInUser = ({
  setPage,
  setToken,
  client,
  loggedInUser
}) => {
  const { t } = useTranslation()

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    client.resetStore()
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

  return (
    <Grid container spacing={2} justify='center' alignItems='center'>
      <Grid item style={{ padding: '12px' }}>
        <ButtonGroup
          variant='contained'
          color='primary'
          size='large'
          aria-label='large contained primary button group'
        >
          <Button id='menu_profile_button' onClick={handleProfileClick}>
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
    </Grid>
  )
}
export default MenubarForLoggedInUser
