import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  container: {
    minWidth: 400
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    minWidth: 200,
    width: 280
  },
  button: {
    backgroundColor: '#718792'
  }
})

const SearchField = props => {
  const classes = useStyles()
  // console.log(props)
  return (
    <form>
      <TextField
        id='search_field'
        variant='filled'
        label='Search by keyword: '
        color='secondary'
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
      <Button
        onClick={props.handleSearchAll}
        className={classes.button}
        variant='contained'
        size='large'
        type='submit'
      >
        Show all
      </Button>
    </form>
  )
}
export default SearchField
