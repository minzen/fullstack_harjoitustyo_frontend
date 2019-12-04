import React from 'react'
import { ButtonGroup, Button, Grid } from '@material-ui/core'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { LOGIN_PAGE, REGISTER_PAGE } from '../constants/pages'
import { useTranslation } from 'react-i18next'

const MenubarForNoLoggedInUser = ({ setPage }) => {
  const { t } = useTranslation()
  return (
    <Grid container spacing={2} justify='center' alignItems='center'>
      <Grid item style={{ padding: '12px' }}>
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
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}
export default MenubarForNoLoggedInUser
