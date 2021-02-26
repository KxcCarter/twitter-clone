import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { ME_QUERY } from '../pages/Profile'

const FOLLOW_USER_MUTATION = gql`
  mutation follow($followId: Int!, $avatar: String!, $name: String!) {
    follow(followId: $followId, avatar: $avatar, name: $name) {
      id
    }
  }
`

interface Props {
  id: number
  name: string
  avatar: string
}

const FollowUser = ({ id, name, avatar }: Props) => {
  const [follow] = useMutation(FOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const handleFollow = async () => {
    await follow({
      variables: { followId: id, name, avatar },
    })
  }

  return (
    <div>
      <button onClick={handleFollow} className="edit-button">
        Follow
      </button>
    </div>
  )
}

export default FollowUser
