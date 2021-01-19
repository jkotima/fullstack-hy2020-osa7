import React, { useState, useEffect } from 'react'
import Logout from '../components/Logout'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Paper, Tabs, Tab, Grid } from '@material-ui/core/'

const LinkTab = (props) => {
  const history = useHistory()
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault()
        history.push(props.href)
      }}
      {...props}
    />
  )
}

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(0)
  const loggedInUser = useSelector(state => state.loggedInUser)
  useEffect(() => {
    if (window.location.pathname.includes('/users')) {
      setSelectedItem(1)
    } else {
      setSelectedItem(0)
    }
  }, [])

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue)
  }

  return (
    <Paper square>
      <Grid container>
        <Grid item xs={9}>
          <Tabs
            value={selectedItem}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <LinkTab label="blogs" href="/" />
            <LinkTab label="users" href="/users" />
          </Tabs>
        </Grid>
        <Grid item xs={3} align={'right'}>
          <div >
            <Logout loggedInUser={loggedInUser} />
          </div>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Menu