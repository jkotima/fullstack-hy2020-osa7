import React from 'react'
import { Link } from 'react-router-dom'
import Logout from '../components/Logout'
import { useSelector } from 'react-redux'

const Menu = () => {
  const loggedInUser = useSelector(state => state.loggedInUser)

  const menuStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
    background: 'lightgrey'
  }
  return (
    <div style={menuStyle}>
      <Link style={{ paddingRight: 5 }} to="/">blogs</Link>
      <Link style={{ paddingRight: 5 }} to="/users">users</Link>
      <Logout loggedInUser={loggedInUser} />
    </div>
  )
}

export default Menu