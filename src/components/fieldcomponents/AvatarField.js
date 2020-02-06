import React from 'react'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MyTheme from '../../styles/MyTheme'

const useStyles = makeStyles({
  avatar: {
    width: 60,
    height: 60,
    color: 'white',
    backgroundColor: MyTheme.palette.secondary.main
  }
})

const AvatarField = ({ loggedInUser }) => {
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

  return (
    <Avatar className={classes.avatar}>{buildInitialsForMenuAvatar()}</Avatar>
  )
}
export default AvatarField
