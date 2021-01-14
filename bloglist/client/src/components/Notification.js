import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification === null) {
    return null
  }

  if (notification.error) {
    return (
      <div className="error">
        {notification.message}
      </div>
    )
  }

  return (
    <div className="notification">
      {notification.message}
    </div>
  )
}

export default Notification