import React, { useContext, useState } from 'react'
import { LabelsContext } from '../App'
import Popup from 'reactjs-popup'
import '../styles/App.css'
import ReviewForm from './ReviewForm'

function EditButton ({ token, review, onSubmit }) {
  const [open, setOpen] = useState(false)
  const labels = useContext(LabelsContext)

  const handleReview = (e) => {
    setOpen(false)
    /* Put review in database, update professor. */
    const newReview = { id: review.id, review: e.text, scores: e.scores, course: review.course_id, school: review.school_id, professor: review.professor_id, student: token.id }
    fetch('http://localhost:3001/api/v1/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    })
      .then(response => response.json())
      .then(data => {
        onSubmit()
      })
  }

  return (
    <>
      <div className='review-professor-container'><button className='review-professor-button' onClick={() => setOpen(true)}>Edit Review</button></div>
      <Popup open={open} onClose={() => setOpen(false)} modal nested>
        <ReviewForm labels={labels} original={review} onSubmit={handleReview} />
      </Popup>
    </>

  )
}

export default EditButton
