import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import '../styles/App.css'
import ReviewForm from './ReviewForm'

function ReviewButton ({ token, labels, professor, setProfessor }) {
  const [open, setOpen] = useState(false)

  const handleReview = (e) => {
    setOpen(false)
    /* Put review in database, update professor. */
    const review = { review: e.text, scores: e.scores, course: 1, school: 1, professor: professor.id, student: token.id }
    fetch('http://localhost:3001/api/v1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })
      .then(response => response.json())
      .then(data => {
      // TODO: handle error cases
        setProfessor(data.professor)
      })
  }

  return (
    <>
      <div className='review-professor-container'><button className='review-professor-button' onClick={() => setOpen(true)}>{`Review ${professor?.first_name} ${professor?.last_name}`}</button></div>
      <Popup open={open} onClose={() => setOpen(false)} modal nested>
        <ReviewForm labels={labels} onSubmit={handleReview} />
      </Popup>
    </>

  )
}

export default ReviewButton
