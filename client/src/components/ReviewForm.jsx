import React, { useState } from 'react'
import StarRatings from 'react-star-ratings'

function RatingInput ({ value, onChange }) {
  return (
    <StarRatings rating={value} numberOfStars={5} changeRating={onChange} starDimension='30px' starSpacing='0px' />
  )
}

function ReviewForm ({ onSubmit, labels, original, courses }) {
  const [scores, setScores] = useState(original
    ? [original.overall, original.quality1, original.quality2,
        original.quality3, original.quality4, original.quality5].map(e => e / 100)
    : [5, 5, 5, 5, 5, 5])
  const [text, setText] = useState(original ? original.review : '')
  const [course, setCourse] = useState(original ? original.course_name : '')
  const [courseList] = useState(courses || (original ? [{ id: original.course_id, name: original.course_name }] : []))
  const [warn, setWarn] = useState(false)

  console.log(original)

  const handleScoreChange = (index, value) => {
    const newScores = [...scores]
    newScores[index] = value
    setScores(newScores)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (course === '') {
      setWarn(true)
    } else {
      setWarn(false)
      const review = { course, scores: scores.map(val => val * 100), text }
      onSubmit(review)
    }
  }

  return (
    <div className='review-form-container'>
      <h2 className='review-form-header'>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className='review-form-group'>
          <label>Course</label>
          <select value={course} onChange={e => setCourse(Number(e.target.value))}>
            <option disabled value=''> -- Select a Class -- </option>
            {courseList && courseList.filter(course => course.id !== 0).map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
        </div>
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
        {warn && <div className='warn'>Select a course!</div>}
        <button type='submit' className='review-form-button'>Submit</button>
      </form>
    </div>
  )
}

export default ReviewForm
