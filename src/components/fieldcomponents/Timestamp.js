import React from 'react'

const Timestamp = ({ timestamp }) => {
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

  return <>Last modified: {convertTimeStampToDate(timestamp)}</>
}
export default Timestamp
