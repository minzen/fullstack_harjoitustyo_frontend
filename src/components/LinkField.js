import React from 'react'
import { Link, Typography } from '@material-ui/core'

const LinkField = ({ link }) => {
  if (!link) {
    return <></>
  }

  return (
    <Typography data-cy='linkField' variant='body1' gutterBottom>
      Link: <Link href={link}>{link}</Link>
    </Typography>
  )
}
export default LinkField
