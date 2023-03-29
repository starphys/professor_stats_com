import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import ReviewForm from './ReviewForm'

function ReviewButton ({ professor }) {

  const [open, setOpen] = useState(false)

  const handleReview = (e) => {
    console.log(e)
    setOpen(false)
    /* Put review in database, update professor. */
  }

  return (
    <>
      <div className='review-professor-container'><button className='review-professor-button' onClick={() => setOpen(true)}>{`Review ${professor?.first_name} ${professor?.last_name}`}</button></div>
      <Popup open={open} onClose={() => setOpen(false)} modal nested>
        <ReviewForm onSubmit={handleReview} />
      </Popup>
    </>

  )
}

export default ReviewButton
