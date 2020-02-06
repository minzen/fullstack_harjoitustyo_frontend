import React from 'react'
import { Link, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles({
  link: {
    color: 'lightblue'
  }
})

const LinkField = ({ link }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  if (!link) {
    return <></>
  }

  return (
    <Typography
      data-cy='linkField'
      variant='body1'
      gutterBottom
      className={classes.link}
    >
      {t('Link')} <Link href={link}>{link}</Link>
    </Typography>
  )
}
export default LinkField
