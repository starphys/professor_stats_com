import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewPopup from '../components/ReviewPopup'

const ProfessorPage = ({ token, prof }) => {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/professors/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProfessor(data.professor)
        } else {
        // TODO: Handle professor not found
          setProfessor(null)
        }
      })
  }, [prof, id, setProfessor])

  useEffect(() => {
    if (professor) {
      fetch(`http://localhost:3001/api/v1/reviews/${professor.id}`, {
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
  }, [professor, setReviews])

  if (!professor || !reviews) {
    return <div><b>Loading</b></div>
  }

  return (
    <div className='professor-container'>
      <div className='professor-info'>
        <img src={`${process.env.PUBLIC_URL}/images/${professor.id}.jpg`} alt={`${professor.first_name} ${professor.last_name}`} />
        <div className='professor-details'>
          <h2>{professor.first_name} {professor.last_name}</h2>
          <p className='degrees'>{professor.degrees}</p>
          <div className='ratings-container'>
            <div className='rating'>
              {(professor.overall / 100).toFixed(1)}
              <span>/5.0</span>
            </div>
            <div className='quality-ratings-container'>
              <div className='quality-rating'>
                <span className='rating-label'>Goodness</span>
                <span className='rating-value'>{(professor.quality1 / 100).toFixed(1)}</span>
              </div>
              <div className='quality-rating'>
                <span className='rating-label'>Greatness</span>
                <span className='rating-value'>{(professor.quality2 / 100).toFixed(1)}</span>
              </div>
              <div className='quality-rating'>
                <span className='rating-label'>Exceptionality</span>
                <span className='rating-value'>{(professor.quality3 / 100).toFixed(1)}</span>
              </div>
              <div className='quality-rating'>
                <span className='rating-label'>Bestness</span>
                <span className='rating-value'>{(professor.quality4 / 100).toFixed(1)}</span>
              </div>
              <div className='quality-rating'>
                <span className='rating-label'>Praiseworthiness</span>
                <span className='rating-value'>{(professor.quality5 / 100).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {token && token.id && <ReviewPopup token={token} professor={professor} setProfessor={setProfessor}/>}
      <h3>Reviews:</h3>
      {reviews.map((review) => (
        <div key={review.id} className='review-container'>
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

export default ProfessorPage
