import React, { useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Modal from 'react-modal'
import * as Yup from 'yup'
import { gql, useMutation, useQuery } from '@apollo/client'
//
import { customStyles } from '../styles/CustomModalStyles'
import '../styles/tweet.css'

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($content: String!, $id: Int!) {
    createComment(content: $content, id: $id) {
      id
    }
  }
`

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

interface CommentProps {
  content: string
}
interface Props {
  tweet: string
  name: string
  avatar: string
  id: number
}

const CreateComment = ({ tweet, avatar, name, id }: Props) => {
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const initialValues: CommentProps = {
    content: '',
  }

  const validationSchema = Yup.object({
    content: Yup.string()
      .required()
      .min(1, 'Must be more than 1 character.')
      .max(256, 'Must be less than 257 characters.'),
  })

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <div>
      <span onClick={openModal}>
        <i className="far fa-comment" aria-hidden="true"></i>
      </span>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
        <div className="header"></div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 8fr',
            marginTop: '10px',
          }}
        >
          <img
            src={avatar}
            style={{ width: '40px', borderRadius: '50%' }}
            alt="avatar"
          />
          <h5>{name}</h5>
        </div>

        <p
          style={{
            marginLeft: '20px',
            borderLeft: '1px solid var(--accent)',
            paddingLeft: '20px',
            height: '50px',
            marginTop: 0,
          }}
        >
          {tweet}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await createComment({
              variables: { ...values, id },
            })
            setSubmitting(false)
            setModalIsOpen(false)
          }}
        >
          <Form>
            <img
              src={data.me.Profile.avatar}
              style={{ width: '40px', borderRadius: '50%' }}
              alt="avatar"
            />
            <Field
              name="content"
              type="text"
              as="textarea"
              placeholder="Tweet your reply..."
            />
            <ErrorMessage name="content" component={'div'} />

            <div className="footer"></div>
            <button className="tweet-button" type="submit">
              <span>Reply</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default CreateComment
