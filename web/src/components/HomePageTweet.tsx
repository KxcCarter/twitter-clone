import React from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
//
import '../styles/tweet.css'
import { TWEETS_QUERY } from './AllTweets'

const CREATE_TWEET_MUTATION = gql`
  mutation createTweet($content: String) {
    createTweet(content: $content) {
      id
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

const HomePageTweet = () => {
  const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }],
  })

  const initialValues: TweetValues = {
    content: '',
  }

  return (
    <div className="home-page-tweet">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true)
          await createTweet({
            variables: values,
          })
          setSubmitting(false)
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

          <button className="home-tweet-button" type="submit">
            <span>Tweet</span>
          </button>
        </Form>
      </Formik>
      <div className="footer"></div>
    </div>
  )
}

export default HomePageTweet
