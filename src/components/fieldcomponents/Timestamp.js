import React from 'react'
import { useTranslation } from 'react-i18next'

const Timestamp = ({ timestamp }) => {
  const { t } = useTranslation()

  const convertTimeStampToDate = timestamp => {
    if (!timestamp) {
      return ''
    }
    try {
      const tsAsNumber = Number(timestamp)
      const date = new Date(tsAsNumber)
      const formatted = date
        .toLocaleDateString('DE-de')
        .concat(' ')
        .concat(date.toLocaleTimeString('DE-de'))
      return formatted
    } catch (error) {
      console.log(
        'error when converting a String formatted timestamp to date',
        error
      )
      return ''
    }
  }

  if (!timestamp) {
    return <></>
  }

  return (
    <>
      {t('Last modified')} {convertTimeStampToDate(timestamp)}
    </>
  )
}
export default Timestamp
