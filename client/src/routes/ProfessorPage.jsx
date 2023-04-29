import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewPopup from '../components/ReviewPopup'
import SpiderChart from '../components/SpiderChart'
import Review from '../components/Review'

const ProfessorPage = ({ token, prof }) => {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [qualities, setQualities] = useState([1, 1, 1, 1, 1])
  const [reviews, setReviews] = useState([])

  const updateQualities = (prof) => {
    const scores = [prof.overall, prof.quality1, prof.quality2, prof.quality3, prof.quality4, prof.quality5]
    setQualities(scores.map(e => e / 100))
  }

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/professors/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProfessor(data.professor)
          updateQualities(data.professor)
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
          <SpiderChart data1={{ values: qualities, label: 'All courses' }} style={{ height: 500, width: 500 }} detail />
        </div>
      </div>
      {token && token.id && <ReviewPopup token={token} professor={professor} setProfessor={setProfessor} updateQualities={updateQualities} />}
      <h3>Reviews:</h3>
      {reviews.toReversed().map((review) => (
        <Review review={review} key={review.id} mode='professor' />
      ))}
    </div>
  )
}

export default ProfessorPage
