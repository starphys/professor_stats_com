import React, { useEffect, useState } from 'react'
import SpiderChart from '../components/SpiderChart'

const ComparePage = ({ toCompare }) => {
  const [professors, setProfessors] = useState([])
  const [courses, setCourses] = useState([])
  const [courseSelection, setCourseSelection] = useState(0)
  const [sharedCourses, setSharedCourses] = useState([])
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [data3, setData3] = useState(null)

  useEffect(() => {
    async function getProfessors () {
      const promises = await Promise.all(toCompare.map(professor =>
        fetch(`http://localhost:3001/api/v1/professors/${professor.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      ))
      const results = await Promise.all(promises.map(p => p.json()))
      setProfessors(results.map(prof => prof.professor))
      setCourses(results.map(prof => prof.course_reviews))
    }
    getProfessors()
  }, [toCompare, setProfessors, setCourses])

  useEffect(() => {
    // Compare all course arrays and only allow users to choose between overlapping courses
    if (courses.length < 2) { return }
    const newCourses = courses.reduce((acc, courseList, i, arr) => {
      const filtered = acc.filter(course => {
        const toReturn = courseList.findIndex(c => Number(c.id) === Number(course.id)) > -1
        return toReturn
      })
      return filtered
    }, courses[0])
    setSharedCourses(newCourses)

    setData1({ values: courses[0].find(cr => cr.id === courseSelection).scores, label: `${professors[0].first_name} ${professors[0].last_name}` })
    setData2({ values: courses[1].find(cr => cr.id === courseSelection).scores, label: `${professors[1].first_name} ${professors[1].last_name}` })
    if (courses.length > 2) {
      setData3({ values: courses[2].find(cr => cr.id === courseSelection).scores, label: `${professors[2].first_name} ${professors[2].last_name}` })
    }
  }, [courses, courseSelection, professors])

  if (professors.length < 1) {
    return <div><b>Loading</b></div>
  }

  return (
    <div className='compare-container'>
      <div className='ratings-container'>
        <SpiderChart data1={data1} data2={data2} data3={data3} style={{ height: 500, width: 500 }} detail />
      </div>
      <div className='compare-center'>
        <select className='compare-select' onChange={e => setCourseSelection(Number(e.target.value))}>
          {sharedCourses.length > 0 && sharedCourses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
        </select>
      </div>
      <div className='prof-det-horizontal'>
        {professors.map(professor => {
          return (
            <div className='prof-det-vertical' key={professor.id}>
              <img className='profile-pic' src={`${process.env.PUBLIC_URL}/images/${professor.id}.jpg`} alt={`${professor.first_name} ${professor.last_name}`} />
              <h2>{professor.first_name} {professor.last_name}</h2>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComparePage
