import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewPopup from '../components/ReviewPopup'
import SpiderChart from '../components/SpiderChart'

const ProfessorPage = ({ token, prof }) => {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [qualities, setQualities] = useState([1,1,1,1,1])
  const [reviews, setReviews] = useState([])

  const labels = ['Overall', 'Goodness', 'Greatness', 'Exceptionality', 'Bestness', 'Praiseworthiness']

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/professors/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProfessor(data.professor)
          setQualities([data.professor.overall, data.professor.quality1, data.professor.quality2, data.professor.quality3, data.professor.quality4, data.professor.quality5].map(e => e/100))
        } else {
        // TODO: Handle professor not found
          setProfessor(null)
        }
      })
  }, [prof, id, setProfessor])

  useEffect(() => {
    if (professor) {
      fetch(`http://localhost:3001/api/v1/reviews/professor/${professor.id}`, {
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

  if (!professor || reviews.length < 1) {
    return <div><b>Loading</b></div>
  }

  return (
    <div className='professor-container'>
      <div className='professor-info'>
      <div className='professor-details'>
        <img src={`${process.env.PUBLIC_URL}/images/${professor.id}.jpg`} alt={`${professor.first_name} ${professor.last_name}`} />
        <div>
          <h2>{professor.first_name} {professor.last_name}</h2>
        <p className='degrees'>{professor.degrees}</p>
        </div>
        </div>
        <div className='ratings-container'>
          <SpiderChart labels={labels} data1={{values:qualities, label:"All courses"}}style={{height:500,width:500}}/>
        </div>
      </div>
      {token && token.id && <ReviewPopup token={token} labels={labels} professor={professor} setProfessor={setProfessor} />}
      <h3>Reviews:</h3>
      {reviews.map((review) => (
        <div key={review.id} className='review-container'>
          <div className='review-metadata'>
            <strong>{`Reviewer: ${review.student_username}`}</strong>
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

export default ProfessorPage
