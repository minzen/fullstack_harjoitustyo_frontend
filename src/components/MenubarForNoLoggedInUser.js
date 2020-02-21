import React from 'react'
import { ButtonGroup, Button, Grid } from '@material-ui/core'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import InfoIcon from '@material-ui/icons/Info'
import { LOGIN_PAGE, REGISTER_PAGE, ABOUT_PAGE } from '../constants/pages'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './fieldcomponents/LanguageSelector'

const MenubarForNoLoggedInUser = ({ setPage }) => {
  const { t } = useTranslation()

  return (
    <Grid
      container
      direction='row'
      spacing={2}
      justify='center'
      alignItems='center'
    >
      <Grid item>
        <ButtonGroup
          variant='contained'
          color='primary'
          size='large'
          aria-label='large contained primary button group'
        >
          <Button id='menu_login_button' onClick={() => setPage(LOGIN_PAGE)}>
            {t('Login')}&nbsp;
            <LockOpenIcon />
          </Button>
          <Button
            id='menu_register_button'
            onClick={() => setPage(REGISTER_PAGE)}
          >
            {t('Register')}&nbsp;
            <PersonAddIcon />
          </Button>
          <Button id='menu_about_button' onClick={() => setPage(ABOUT_PAGE)}>
            {t('About')}&nbsp;
            <InfoIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <LanguageSelector />
      </Grid>
    </Grid>
  )
}
export default MenubarForNoLoggedInUser
