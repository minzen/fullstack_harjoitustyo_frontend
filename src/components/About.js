import React from 'react'
import { Grid } from '@material-ui/core'

const About = ({ show }) => {
  if (!show) {
    return null
  }

  return (
    <>
      <Grid>
        <h2>About</h2>
        <p>
          This application enables storing "memory tracks", relevant notes,
          links etc. to be searched and obtained later when needed.
        </p>
      </Grid>
    </>
  )
}
export default About
