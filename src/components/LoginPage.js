import React from 'react'
import LoginForm from './LoginForm'

const LoginPage = ({ show, handleSpinnerVisibility, login, setToken }) => {
  if (!show) {
    return null
  }

  return (
    <>
      <LoginForm
        login={login}
        setToken={token => setToken(token)}
        handleSpinnerVisibility={handleSpinnerVisibility}
      />
    </>
  )
}
export default LoginPage
