import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles({
  container: {
    minWidth: 400
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    minWidth: 200,
    width: 280
  }
})

const FilterField = props => {
  const classes = useStyles()

  const handleClearField = () => {
    if (props.searchTerm !== '') {
      props.setSearchTerm('')
    }
  }
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
        InputProps={{
          endAdornment: (
            <InputAdornment position='end' onClick={handleClearField}>
              <ClearIcon />
            </InputAdornment>
          )
        }}
      />
    </form>
  )
}
export default FilterField
