import React, { useState } from 'react'
import { TextField, InputAdornment, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles({
  textField: {
    marginLeft: 10,
    marginRight: 10,
    minWidth: 200,
    width: 280
  }
})

const FilterField = props => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleClearField = () => {
    if (props.searchTerm !== '') {
      props.setSearchTerm('')
    }
  }

  return (
    <>
      <form>
        <TextField
          id='search_field'
          variant='filled'
          label={t('Search by keyword')}
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
        <Button
          data-cy='submitConfirmation'
          onClick={props.handleToggleShowAllNotes}
          color='primary'
          variant='contained'
        >
          {props.showNotesButtonText}
        </Button>
      </form>
    </>
  )
}
export default FilterField
