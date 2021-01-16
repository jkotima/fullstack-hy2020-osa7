import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import loggedInUserReducer from './reducers/loggedInUserReducer'
import userReducer from './reducers/userReducer'

const combinedReducer = combineReducers({
  notification: notificationReducer,
  blogs: blogReducer,
  users: userReducer,
  loggedInUser: loggedInUserReducer
})

const store = createStore(combinedReducer, applyMiddleware(thunk))

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)