import React from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { IconButton } from '@material-ui/core/'

const Logout = ({ loggedInUser }) => (
  <>
    <IconButton
      aria-label="logout"
      onClick={() => {
        window.localStorage.removeItem('loggedBlogappUser')
        window.location.reload()
      }}
      size='small'
    >
      <ExitToAppIcon fontSize="small" />
      log out ({loggedInUser.name})
    </IconButton>
  </>
)

export default Logout