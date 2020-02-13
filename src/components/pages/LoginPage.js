import React from 'react'
import LoginForm from '../forms/LoginForm'

const LoginPage = ({
  show,
  handleSpinnerVisibility,
  login,
  client,
  setToken,
  setPage
}) => {
  if (!show) {
    return null
  }

  return (
    <>
      <LoginForm
        login={login}
        client={client}
        setToken={setToken}
        handleSpinnerVisibility={handleSpinnerVisibility}
        setPage={setPage}
      />
    </>
  )
}
export default LoginPage
