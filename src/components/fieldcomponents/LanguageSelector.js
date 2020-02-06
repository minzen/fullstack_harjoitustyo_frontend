import React, { useState } from 'react'
import { InputLabel, Select, MenuItem } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import i18n from '../../i18n'
import Flag from 'react-world-flags'

const useStyles = makeStyles({
  flag: {
    width: 30,
    paddingLeft: 10
  }
})

const LanguageSelector = () => {
  const [lang, setLanguage] = useState('en')
  const { t } = useTranslation()
  const classes = useStyles()

  const handleChange = event => {
    setLanguage(event.target.value)
    i18n.changeLanguage(event.target.value)
  }

  return (
    <>
      <InputLabel id='language_select_label'>{t('Language')}</InputLabel>
      <Select
        labelId='language_select_label'
        id='language_select'
        value={lang}
        onChange={handleChange}
      >
        <MenuItem value={'en'}>
          {t('English')}
          <Flag code={'GB'} className={classes.flag} />
        </MenuItem>
        <MenuItem value={'fi'}>
          {t('Finnish')}
          <Flag code={'FI'} className={classes.flag} />
        </MenuItem>
        <MenuItem value={'de'}>
          {t('German')}
          <Flag code={'DE'} className={classes.flag} />
        </MenuItem>
      </Select>
    </>
  )
}
export default LanguageSelector
