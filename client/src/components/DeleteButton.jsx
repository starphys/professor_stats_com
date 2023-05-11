import React, { useContext, useState } from 'react'
import { LabelsContext } from '../App'
import Popup from 'reactjs-popup'
import '../styles/App.css'
import ReviewForm from './ReviewForm'

function EditButton ({ token, review, onSubmit }) {
  const [open, setOpen] = useState(false)

  const handleReview = (e) => {
    setOpen(false)

    const newReview = { id: review.id, course: review.course_id, school: review.school_id, professor: review.professor_id, student: token.id }
    fetch('http://localhost:3001/api/v1/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    })
      .then(response => response.json())
      .then(data => {
        onSubmit()
      })
  }

  return (
    <div className='edit-button review-professor-container'>
      {open ? <button className='review-professor-button-red' onMouseLeave={() => setOpen(false)} onClick={handleReview}>Confirm Delete</button> : <button className='review-professor-button' onMouseLeave={() => setOpen(false)} onClick={() => setOpen(true)}>Delete Review</button>}
    </div>
  )
}

export default EditButton