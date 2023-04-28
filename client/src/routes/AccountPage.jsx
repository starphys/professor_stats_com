import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function AccountPage ({ token }) {
  const { username } = useParams()
  const [student, setStudent] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/students/user/${username}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.status === 'success') {
          setStudent(data.student)
        } else {
        // TODO: Handle student not found
          setStudent(null)
        }
      })
  }, [username, setStudent])

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
    return <div><b>Loading</b></div>
  }

  // Student is viewing own page
  if (token?.id !== student?.id) {
  }

  // Student is viewing other page
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
      {reviews.map((review) => (
        <div key={review.id} className='review-container'>
          <div className='review-metadata'>
            <strong>{`Professor: ${review.professor_first} ${review.professor_last}`}</strong>
            <strong>{`Course: ${review.course_name} `}</strong>
            <strong>{`School: ${review.school_name} `}</strong>
          </div>
          <div className='review-scores'>
            <p>
              <strong>Score 1:</strong> {(review.overall / 100).toFixed(1)}
            </p>
            <p>
              <strong>Score 2:</strong> {(review.quality1 / 100).toFixed(1)}
            </p>
            <p>
              <strong>Score 3:</strong> {(review.quality2 / 100).toFixed(1)}
            </p>
            <p>
              <strong>Score 4:</strong> {(review.quality3 / 100).toFixed(1)}
            </p>
            <p>
              <strong>Score 5:</strong> {(review.quality4 / 100).toFixed(1)}
            </p>
            <p>
              <strong>Score 5:</strong> {(review.quality5 / 100).toFixed(1)}
            </p>
          </div>
          <div className='review-review'>
            <p>
              <strong>Text Review:</strong> {review.review}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AccountPage
