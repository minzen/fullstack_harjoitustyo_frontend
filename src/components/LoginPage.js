import React from 'react'
import LoginForm from './LoginForm'

const LoginPage = ({
  show,
  handleSpinnerVisibility,
  login,
  client,
  setToken,
  setLoggedInUser
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
      />
    </>
  )
}
export default LoginPage
