import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from 'apollo-link-context'

import './App.css'
import Landing from './components/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import IsAuthenticated from './components/IsAuthenticated'
import Profile from './pages/Profile'
import Home from './pages/Home'
import SingleTweet from './pages/SingleTweet'
import SingleUser from './pages/SingleUser'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const link = authLink.concat(httpLink as any)
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/landing">
            <Landing />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <IsAuthenticated>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/tweet/:id">
              <SingleTweet />
            </Route>
            <Route exact path="/user/:id">
              <SingleUser />
            </Route>
          </IsAuthenticated>
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

export default App
