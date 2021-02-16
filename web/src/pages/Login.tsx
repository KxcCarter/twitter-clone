import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { Link, useHistory } from 'react-router-dom'

//

import xbones from '../styles/assets/xbones.png'

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

interface LoginValues {
  email: string
  password: string
}

export default function Login() {
  const history = useHistory()
  const [login, { data }] = useMutation(LOGIN_MUTATION)

  const initialValues: LoginValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Password required'),
  })

  return (
    <div className="container">
      <img src={xbones} alt="logo" style={{ width: '50px' }} className="logo" />
      <h3>Log in to Fake Twitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true)
          const response = await login({
            variables: values,
          })
          localStorage.setItem('token', response.data.login.token)
          setSubmitting(false)
          history.push('/users')
        }}
      >
        <Form>
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="email" component={'div'} />

          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component={'div'} />

          <button className="login-button" type="submit">
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Don't have an account?</h4>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}
