import React, { useContext } from 'react'
import SpiderChart from './SpiderChart'
import EditButton from './EditPopup'
import { TokenContext } from '../App'

function Review ({ review, mode, onSubmit }) {
  const qualities = [review.overall, review.quality1, review.quality2, review.quality3, review.quality4, review.quality5].map(e => e / 100)
  const [token, setToken] = useContext(TokenContext)

  if (mode === 'student') {
    return (
      <div className='review-component'>
        <img src={`${process.env.PUBLIC_URL}/images/${review.professor_id}.jpg`} alt={`${review.professor_first} ${review.professor_last}`} />
        <div className='review-container'>
          <div className='review-metadata'>
            <strong>Professor: <a href={`/professor/${review.professor_id}`}>{`${review.professor_first} ${review.professor_last}`}</a></strong>
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
          <div className='review-buttons'>
            {token?.id === review?.student_id ? <EditButton token={token} review={review} onSubmit={onSubmit} /> : ''}
          </div>
        </div>
        <SpiderChart data1={{ values: qualities, label: 'All courses' }} style={{ height: 100, width: 100 }} detail={false} />
      </div>
    )
  } else if (mode === 'professor') {
    return (
      <div className='review-component'>
        <img
          src={`${process.env.PUBLIC_URL}/images/${review.student_username}.jpg`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = `${process.env.PUBLIC_URL}/images/default.jpg`
          }}
          alt={`${review.student_username}`}
        />
        <div className='review-container'>
          <div className='review-metadata'>
            <strong>Reviewer: <a href={`/user/${review.student_username}`}>{`${review.student_username}`}</a></strong>
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
        <SpiderChart data1={{ values: qualities, label: 'All courses' }} style={{ height: 100, width: 100 }} detail={false} />
      </div>
    )
  }
}

export default Review
