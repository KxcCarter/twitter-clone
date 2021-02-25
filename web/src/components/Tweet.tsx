import React, { useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Modal from 'react-modal'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
//
import { customStyles } from '../styles/CustomModalStyles'
import '../styles/tweet.css'

const CREATE_TWEET_MUTATION = gql`
  mutation createTweet($content: String) {
    createTweet(content: $content) {
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

interface TweetValues {
  content: string
}

const validationSchema = Yup.object({
  content: Yup.string()
    .required()
    .min(1, 'Must be more than 1 character.')
    .max(256, 'Must be less than 257 characters.'),
})

const Tweet = () => {
  const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const initialValues: TweetValues = {
    content: '',
  }
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="edit-button"
        style={{ marginRight: '10px', marginTop: '30px' }}
      >
        <span style={{ padding: '15px 70px' }}>Tweet</span>
      </button>
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await createTweet({
              variables: values,
            })
            setSubmitting(false)
            setModalIsOpen(false)
          }}
        >
          <Form>
            <Field
              name="content"
              type="text"
              as="textarea"
              placeholder="What's happening..."
            />
            <ErrorMessage name="content" component={'div'} />

            <div className="footer"></div>
            <button className="tweet-button" type="submit">
              <span>Tweet</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default Tweet
