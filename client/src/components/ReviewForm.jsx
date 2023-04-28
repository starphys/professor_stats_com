import React, { useState } from 'react'
import StarRatings from 'react-star-ratings'

function RatingInput ({ value, onChange }) {
  return (
    <StarRatings rating={value} numberOfStars={5} changeRating={onChange} starDimension='30px' starSpacing='0px' />
  )
}

function ReviewForm ({ onSubmit, labels }) {
  const [scores, setScores] = useState([5, 5, 5, 5, 5, 5])
  const [text, setText] = useState('')

  const handleScoreChange = (index, value) => {
    const newScores = [...scores]
    newScores[index] = value
    setScores(newScores)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const review = { scores: scores.map(val => val * 100), text }
    onSubmit(review)
    setScores([5, 5, 5, 5, 5, 5])
    setText('')
  }

  return (
    <div className='review-form-container'>
      <h2 className='review-form-header'>Leave a Review</h2>
      <form onSubmit={handleSubmit}>

        {labels && labels.map((label, i) => {
          return (
            <div className='review-form-group' key={i}>
              <label>{label}</label>
              <RatingInput value={scores[i]} onChange={(value) => handleScoreChange(i, value)} />
            </div>
          )
        })}
        <div className='review-form-group-text'>
          <label>Review:</label>
          <textarea
            className='review-form-control'
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
        <button type='submit' className='review-form-button'>Submit</button>
      </form>
    </div>
  )
}

export default ReviewForm
