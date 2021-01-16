import React from 'react'

const Logout = ({ loggedInUser }) => (
  <div>
    <p>
      {loggedInUser.name} logged in
      <button onClick={() => {
        window.localStorage.removeItem('loggedBlogappUser')
        window.location.reload()
      }
      }>logout</button>
    </p>
  </div>
)

export default Logout