import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentResult ({ result, handleChoice }) {
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/students/${result.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setStudent(data.student)
        } else {
        // TODO: Handle student not found
          setStudent(null)
        }
      })
  }, [result.id, setStudent])

  if (!student) {
    <strong>Loading</strong>
  } else {
    return (
      <div className='search-result' onClick={() => navigate(`/user/${result.username}`)}>
        <img
          src={`${process.env.PUBLIC_URL}/images/${result.username}.jpg`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = `${process.env.PUBLIC_URL}/images/default.jpg`
          }}
        />
        <div className='result-info'>
          <div className='result-header-text'>
            <strong>{`${result.username}`}</strong>
          </div>
        </div>
      </div>
    )
  }
}

export default StudentResult
