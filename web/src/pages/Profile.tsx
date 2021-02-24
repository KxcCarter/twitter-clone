import React from 'react'
import { gql, useQuery } from '@apollo/client'
import CreateProfile from '../components/CreateProfile'
import UpdateProfile from '../components/UpdateProfile'
import { Link, useHistory } from 'react-router-dom'

import '../styles/primary.css'
import '../styles/profile.css'

const ME_QUERY = gql`
  query me {
    me {
      id
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

const Profile = () => {
  const history = useHistory()
  const { loading, error, data } = useQuery(ME_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  console.log(data.me)

  return (
    <>
      <div className="primary">
        <div className="left">Left Nav</div>
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head">
              <span className="back-arrow" onClick={() => history.goBack}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span className="nickname">
                <h3>{data.me.name} fart?</h3>
              </span>
            </div>
            <div className="avatar">
              <i className="fa fa-user fa-5x" aria-hidden="true"></i>
            </div>
            <div className="make-profile">
              {data.me.Profile.id ? <UpdateProfile /> : <CreateProfile />}
            </div>
            <h3 className="name">{data.me.name} fartsssss</h3>
            {data.me.Profile.id ? (
              <p>
                <i className="fas fa-link"> </i>
                <Link
                  to={{ pathname: `http://${data.me.Profile.website}` }}
                  target="_blank"
                >
                  {data.me.Profile.website}
                </Link>
              </p>
            ) : null}
            <div className="followers">
              <p>200 following</p>
              <p>233 followers</p>
            </div>
          </div>
        </div>
        <div className="right">RIGHT?</div>
      </div>
    </>
  )
}

export default Profile
