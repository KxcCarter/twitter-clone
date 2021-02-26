import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { ME_QUERY } from '../pages/Profile'
import { TWEETS_QUERY } from './AllTweets'

const DELETE_LIKE_MUTATION = gql`
  mutation DeleteLike($id: Int!) {
    deleteLike(id: $id) {
      id
    }
  }
`

interface Props {
  id: number
}

const DeleteLike = ({ id }: Props) => {
  const [deleteLike] = useMutation(DELETE_LIKE_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: ME_QUERY }],
  })

  const handleDeleteLike = async () => {
    await deleteLike({ variables: { id } })
  }

  return (
    <span onClick={handleDeleteLike} style={{ marginRight: '5px' }}>
      <i className="fas fa-thumbs-up" aria-hidden="true"></i>
    </span>
  )
}

export default DeleteLike
