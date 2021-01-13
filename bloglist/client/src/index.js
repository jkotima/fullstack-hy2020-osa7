import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import notificationReducer from './reducers/notificationReducer'

const combinedReducer = combineReducers ({
  notification: notificationReducer
})

const store = createStore(combinedReducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)