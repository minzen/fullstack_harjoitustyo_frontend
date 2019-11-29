import React from 'react'
import { ButtonGroup, Button, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MemoryIcon from '@material-ui/icons/Memory'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import InfoIcon from '@material-ui/icons/Info'
import MyTheme from '../styles/MyTheme'
import { PROFILE_PAGE, ABOUT_PAGE, NOTES_PAGE } from '../constants/pages'

const useStyles = makeStyles({
  avatar: {
    width: 60,
    height: 60,
    color: 'white',
    backgroundColor: MyTheme.palette.secondary.main
  }
})

const MenubarForLoggedInUser = ({
  setPage,
  setToken,
  client,
  loggedInUser
}) => {
  const classes = useStyles()

  const buildInitialsForMenuAvatar = () => {
    if (!loggedInUser) {
      return 'N/A'
    }
    const givenname =
      loggedInUser.givenname === null || loggedInUser.givenname === ''
        ? 'N'
        : loggedInUser.givenname.substring(0, 1)
    const surname =
      loggedInUser.surname === null ? 'N' : loggedInUser.surname.substring(0, 1)
    return givenname + surname
  }

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    client.resetStore()
  }

  console.log('loggedInUser', loggedInUser)

  return (
    <ButtonGroup
      variant='contained'
      color='primary'
      size='large'
      aria-label='large contained primary button group'
    >
      <Button
        id='menu_profile_button'
        onClick={() => {
          setPage(PROFILE_PAGE)
        }}
      >
        <Avatar className={classes.avatar}>
          {buildInitialsForMenuAvatar()}
        </Avatar>
      </Button>
      <Button id='menu_notes_button' onClick={() => setPage(NOTES_PAGE)}>
        Memory Tracks&nbsp;
        <MemoryIcon />
      </Button>
      <Button
        id='menu_about_button'
        onClick={() => {
          setPage(ABOUT_PAGE)
        }}
      >
        About&nbsp;
        <InfoIcon />
      </Button>
      <Button id='menu_logout_button' onClick={handleLogout}>
        Logout&nbsp;
        <ExitToAppIcon />
      </Button>
    </ButtonGroup>
  )
}
export default MenubarForLoggedInUser
