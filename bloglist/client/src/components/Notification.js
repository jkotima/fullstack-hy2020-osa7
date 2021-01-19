import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, SnackbarContent } from '@material-ui/core/'
import { setNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setOpen(true)
  }, [notification])

  const handleClose = () => {
    setOpen(false)
    dispatch(setNotification(null))
  }

  if (!notification) {
    return null
  }

  const errorStyle = notification.error
    ? { backgroundColor:'red' }
    : { backgroundColor:'teal' }

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        autoHideDuration={5000}
      >
        <SnackbarContent
          style={errorStyle}
          message={<span id="client-snackbar">{notification.message}</span>}
        />
      </Snackbar>
    </div>
  )

}

export default Notification