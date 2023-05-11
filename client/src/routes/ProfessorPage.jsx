import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewPopup from '../components/ReviewPopup'
import SpiderChart from '../components/SpiderChart'
import Review from '../components/Review'
import { v4 as uuidv4 } from 'uuid'

const ProfessorPage = ({ token }) => {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [courses, setCourses] = useState([])
  const [courseSelection, setCourseSelection] = useState(0)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/professors/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProfessor(data.professor)
          setCourses(data.course_reviews)
        } else {
        // TODO: Handle professor not found
          setProfessor(null)
        }
      })
  }, [id, refresh, setProfessor])

  useEffect(() => {
    if (professor) {
      fetch(`http://localhost:3001/api/v1/reviews/professor/${id}`, {
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

  if (!professor) {
    return <div><b>Loading</b></div>
  }

  return (
    <div className='professor-container'>
      <div className='professor-info'>
        <div className='professor-details'>
          <div className='prof-det-vertical'>
            <div className='image-cropper'>
              <img className='profile-pic' src={`${process.env.PUBLIC_URL}/images/${professor.id}.jpg`} alt={`${professor.first_name} ${professor.last_name}`} />
            </div>
            <div>
              <h2>{professor.first_name} {professor.last_name}</h2>
              <p className='degrees'>{professor.degrees}</p>
            </div>
          </div>
          <div className='compare-center'>
            <select className='compare-select' onChange={e => setCourseSelection(Number(e.target.value))}>
              {courses && courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
          </div>
        </div>
        <div className='ratings-container'>
          <SpiderChart data1={{ values: courses.find(cr => cr.id === courseSelection).scores, label: courses.find(cr => cr.id === courseSelection).name }} style={{ height: 500, width: 500 }} detail />
        </div>
      </div>
      {token && token.id && <ReviewPopup token={token} professor={professor} setRefresh={setRefresh} courses={courses} />}
      <h3>Reviews:</h3>
      {reviews.length < 1 && <div className='review-component'>No reviews found.</div>}
      {reviews.toReversed().filter(review => courseSelection === 0 || review.course_id === courseSelection).map((review) => (
        <Review review={review} key={uuidv4()} mode='professor' />
      ))}
    </div>
  )
}

export default ProfessorPage
