import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpiderChart from './SpiderChart'

function Result ({ result, compare, full, handleChoice }) {
  const navigate = useNavigate()
  const qualities = [result.overall, result.quality1, result.quality2, result.quality3, result.quality4, result.quality5].map(e => e / 100)

  const [professor, setProfessor] = useState(null)
  const [courses, setCourses] = useState([])
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    setChecked(checked => !checked)
    handleChoice(!checked, result)
  }

  useEffect(() => {
    setChecked(false)
  }, [compare, setChecked])

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/professors/${result.id}`, {
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
  }, [result.id, setProfessor])

  if (!professor) {
    <strong>Loading</strong>
  } else {
    return (
      <div className='search-result'>
        <div className='search-content' onClick={() => navigate(`/professor/${result.id}`)}>
          <img src={`${process.env.PUBLIC_URL}/images/${result.id}.jpg`} alt={`${result.first_name} ${result.last_name}`} />
          <div className='result-info'>
            <div className='result-header-text'>
              <strong>{`${result.first_name} ${result.last_name}, ${result.degrees}`}</strong>
            </div>
            <div>
              <p>Courses: {courses && courses.reduce((string, course) => course.id === 0 ? string : string + course.name + ', ', ['']).slice(0, -2)}</p>
              <p>Schools: {professor.school_name}</p>
            </div>
          </div>
          <SpiderChart data1={{ values: qualities, label: 'All courses' }} style={{ height: 100, width: 100, marginRight: '5%' }} detail={false} />
        </div>
        {compare && <input type='checkbox' className='result-check' value={checked} onClick={handleCheck} disabled={full && !checked} />}
      </div>
    )
  }
}

export default Result
