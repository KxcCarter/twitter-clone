import React, { useState, useRef } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Modal from 'react-modal'

import { customStyles } from '../styles/CustomModalStyles'

const UPDATE_PROFILE_MUTATION = gql`
  mutation updateProfile(
    $id: Int!
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    updateProfile(
      id: $id
      bio: $bio
      location: $location
      website: $website
      avatar: $avatar
    ) {
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

interface ProfileValues {
  id: number
  bio: string
  location: string
  website: string
  avatar: string
}
const UpdateProfile = () => {
  const inputFile = useRef(null)
  const [image, setImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const { loading, error, data } = useQuery(ME_QUERY)
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const [modalIsOpen, setModalIsOpen] = useState(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const initialValues: ProfileValues = {
    id: data.me.Profile.id,
    bio: data.me.Profile.bio,
    location: data.me.Profile.location,
    website: data.me.Profile.website,
    avatar: data.me.Profile.avatar,
  }

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const uploadImage = async (event: any) => {
    console.log('fart!!!!')

    const files = event.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'bhcb3oqk') // not sure about this
    setImageLoading(true)

    const apiURL = process as any
    const res = await fetch(apiURL.env.REACT_APP_CLOUDINARY_API, {
      method: 'POST',
      body: data,
    })

    const file = await res.json()
    setImage(file.secure_url)
    setImageLoading(false)
  }

  const handleClick = () => {
    const node = inputFile.current as any
    node.click()
  }

  return (
    <div>
      <button onClick={openModal} className="edit-button">
        Edit Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <input
          type="file"
          name="file"
          placeholder="upload file"
          onChange={uploadImage}
          ref={inputFile}
          style={{ display: 'none' }}
        />

        {imageLoading ? (
          <h3>Uploading...</h3>
        ) : (
          <>
            {image ? (
              <span onClick={handleClick}>
                <img
                  src={image}
                  style={{ width: '150px', borderRadius: '50%' }}
                  alt="avatar"
                />
              </span>
            ) : (
              <span onClick={handleClick}>
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              </span>
            )}
          </>
        )}

        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await updateProfile({
              variables: { ...values, avatar: image },
            })

            setSubmitting(false)
            setModalIsOpen(false)
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage name="bio" component={'div'} />

            <Field name="location" type="location" placeholder="Location" />
            <ErrorMessage name="location" component={'div'} />

            <Field name="website" type="website" placeholder="Website" />
            <ErrorMessage name="website" component={'div'} />

            <button className="login-button" type="submit">
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default UpdateProfile
