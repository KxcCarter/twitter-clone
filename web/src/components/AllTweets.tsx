import { useQuery } from '@apollo/client'
import { formatDistance } from 'date-fns'
import { subDays } from 'date-fns/esm'
import gql from 'graphql-tag'
import React from 'react'
import { ME_QUERY } from '../pages/Profile'
import '../styles/allTweets.css'
import LikeTweet from './LikeTweet'

export const TWEETS_QUERY = gql`
  query TWEETS_QUERY {
    tweets {
      id
      createdAt
      content
      likes {
        id
      }
      author {
        id
        name
        Profile {
          id
          avatar
        }
      }
    }
  }
`

const AllTweets = () => {
  const { loading, error, data } = useQuery(TWEETS_QUERY)
  const { loading: meLoading, error: meError, data: meData } = useQuery(
    ME_QUERY,
  )
  if (loading || meLoading) return <p>Loading</p>
  if (error) return <p>{error.message}</p>
  if (meError) return <p>{meError.message}</p>

  interface AllTweets {
    id: number
    content: string
    createdAt: Date
    likes: []
    author: {
      name: string
      Profile: {
        avatar: string
      }
    }
  }

  interface LikedTweets {
    id: number
    tweet: {
      id: number
    }
  }

  return (
    <div>
      {data.tweets.map((tweet: AllTweets, index: number) => (
        <div className="tweet-container" key={index}>
          <div className="tweet-header">
            <img
              src={tweet.author.Profile.avatar}
              style={{ width: '40px', borderRadius: '50%' }}
              alt="avatar"
            />
            <h4 className="name">{tweet.author.name}</h4>
            <p className="date-time">
              {formatDistance(
                subDays(new Date(tweet.createdAt), 0),
                new Date(),
              )}{' '}
              ago
            </p>
          </div>
          <p>{tweet.content}</p>
          <div className="likes">
            {meData.me.likedTweet
              .map((t: LikedTweets) => t.tweet.id)
              .includes(tweet.id) ? (
              <span>
                <span style={{ marginRight: '5px' }}>
                  <i className="fas fa-thumbs-up"></i>
                </span>
              </span>
            ) : (
              <span>
                <LikeTweet id={tweet.id} />
                {tweet.likes.length}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllTweets
