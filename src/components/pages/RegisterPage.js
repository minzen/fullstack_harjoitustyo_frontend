import React from 'react'
import RegisterUserForm from '../forms/RegisterUserForm'

const RegisterPage = ({ show, register, handleSpinnerVisibility }) => {
  if (!show) {
    return null
  }

  return (
    <RegisterUserForm
      addUser={register}
      handleSpinnerVisibility={handleSpinnerVisibility}
    />
  )
}
export default RegisterPage
