import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Review from '../components/Review'
import { v4 as uuidv4 } from 'uuid'

function AccountPage ({ token }) {
  const { username } = useParams()
  const [student, setStudent] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rerender, setRerender] = useState(0)

  const onSubmit = () => {
    setRerender(r => r + 1)
  }

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/students/user/${username}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setStudent(data.student)
        } else {
        // TODO: Handle student not found
          setStudent(null)
        }
      })
  }, [username, rerender, setStudent])

  useEffect(() => {
    if (student) {
      fetch(`http://localhost:3001/api/v1/reviews/student/${student.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setReviews(data.reviews)
          } else {
          // TODO: Handle reviews not found
            setReviews([])
          }
        })
    } else {
      setReviews([])
    }
  }, [student, setReviews])

  function uploadFile (e) {
    const file = e.target.files[0]

    const formData = new FormData()
    formData.append('username', username)
    formData.append('profilePicture', file)

    fetch('http://localhost:3001/api/v1/upload/', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response?.status === 'success') {
          console.log('File uploaded successfully')
        } else {
          console.log('Error uploading file.')
        }
      })
  }

  if (!student) {
    return <div><b>User not found!</b></div>
  }

  return (
    <div className='professor-container'>
      <div className='professor-info'>
        <div className='student-picture'>
          <img
            src={`${process.env.PUBLIC_URL}/images/${username}.jpg`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = `${process.env.PUBLIC_URL}/images/default.jpg`
            }}
            alt={`${student.first_name} ${student.last_name}`}
          />
          {token?.id === student?.id ? <div className='upload-pic'><label>Replace Profile Picture</label><input type='file' accept='image/jpeg' onChange={uploadFile} /></div> : ''}
        </div>
        <div className='professor-details'>
          <h2>{student.username}</h2>
          <div className='ratings-container' />
        </div>
      </div>
      <h3>Reviews:</h3>
      {reviews.toReversed().map((review) => (
        <Review review={review} key={uuidv4()} mode='student' onSubmit={onSubmit} />
      ))}
    </div>
  )
}

export default AccountPage
