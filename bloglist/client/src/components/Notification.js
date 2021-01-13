import React from 'react'

const Notification = ({ notification }) => {
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