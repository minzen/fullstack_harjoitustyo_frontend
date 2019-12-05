import React, { useState } from 'react'
import { InputLabel, Select, MenuItem } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

const LanguageSelector = () => {
  const [lang, setLanguage] = useState('en')
  const { t } = useTranslation()

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
        <MenuItem value={'en'}>{t('English')}</MenuItem>
        <MenuItem value={'fi'}>{t('Finnish')}</MenuItem>
        <MenuItem value={'de'}>{t('German')}</MenuItem>
      </Select>
    </>
  )
}
export default LanguageSelector
