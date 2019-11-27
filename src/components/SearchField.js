import React from 'react'
import { Grid, Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  container: {
    minWidth: 400
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    minWidth: 200,
    width: 400
  }
})

const SearchField = props => {
  const classes = useStyles()
  console.log(props)
  return (
    <Grid item>
      <form>
        <TextField
          id='search_field'
          variant='standard'
          label='Search by keyword: '
          onChange={props.handleSearchTermChange}
          value={props.searchTerm}
          className={classes.textField}
        />
        <Button
          onClick={props.handleSubmit}
          color='primary'
          variant='contained'
          size='large'
          type='submit'
        >
          Filter
        </Button>
      </form>
    </Grid>
  )
}
export default SearchField
