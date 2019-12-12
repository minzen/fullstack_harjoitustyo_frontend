import React from 'react'
import LoginForm from '../forms/LoginForm'

const LoginPage = ({
  show,
  handleSpinnerVisibility,
  login,
  client,
  setToken,
  setLoggedInUser,
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
        setToken={token => setToken(token)}
        handleSpinnerVisibility={handleSpinnerVisibility}
        setLoggedInUser={setLoggedInUser}
        setPage={setPage}
      />
    </>
  )
}
export default LoginPage
