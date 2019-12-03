import React from 'react'
import { ButtonGroup, Button } from '@material-ui/core'
import LockOpenIcon from '@material-ui/icons/LockOpen'
//import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { LOGIN_PAGE /* REGISTER_PAGE */ } from '../constants/pages'

const MenubarForNoLoggedInUser = ({ setPage }) => {
  return (
    <ButtonGroup
      variant='contained'
      color='primary'
      size='large'
      aria-label='large contained primary button group'
    >
      <Button id='menu_login_button' onClick={() => setPage(LOGIN_PAGE)}>
        Login&nbsp;
        <LockOpenIcon />
      </Button>
      {/* <Button id='menu_register_button' onClick={() => setPage(REGISTER_PAGE)}>
        Register&nbsp;
        <PersonAddIcon />
      </Button> */}
    </ButtonGroup>
  )
}
export default MenubarForNoLoggedInUser
