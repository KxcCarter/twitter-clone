import React from 'react'
import { gql, useQuery } from '@apollo/client'
import CreateProfile from '../components/CreateProfile'
import UpdateProfile from '../components/UpdateProfile'
import { Link, useHistory } from 'react-router-dom'

//

import LeftNav from '../components/LeftNav'

import '../styles/primary.css'
import '../styles/home.css'
import AllTweets from '../components/AllTweets'
import HomePageTweet from '../components/HomePageTweet'

export const ME_QUERY = gql`
  query me {
    me {
      id
      name
      Profile {
        id
        bio
        location
        website
        avatar
      }
    }
  }
`

const Home = () => {
  const history = useHistory()
  const { loading, error, data } = useQuery(ME_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="home">
          <div className="home-header">
            <h3 className="home-title"></h3>
          </div>
          <HomePageTweet />
          <AllTweets />
        </div>

        <div className="right">RIGHT?</div>
      </div>
    </>
  )
}

export default Home
