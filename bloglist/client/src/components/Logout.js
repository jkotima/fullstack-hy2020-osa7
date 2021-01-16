import React from 'react'

const Logout = ({ loggedInUser }) => (
  <>
    {loggedInUser.name} logged in
    <button onClick={() => {
      window.localStorage.removeItem('loggedBlogappUser')
      window.location.reload()
    }
    }>logout</button>
  </>
)

export default Logout