import React from 'react'

const Profile = ({ show }) => {
  if (!show) {
    return null
  }
  return <h2>Profile</h2>
}
export default Profile
