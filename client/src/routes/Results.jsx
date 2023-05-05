import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Result from '../components/Result'
import StudentResult from '../components/StudentResult'
import '../styles/App.css'

function Results ({ searchResults, searchType, setToCompare }) {
  const navigate = useNavigate()

  const [results, setResults] = useState(searchResults)
  const [compare, setCompare] = useState(false)
  const [choices, setChoices] = useState([])
  const [canConfirm, setCanConfirm] = useState(false)
  const [full, setFull] = useState(false)

  const max = 3

  useEffect(() => {
    setResults(searchResults)
  }, [setResults, searchResults])

  useEffect(() => {
    setCanConfirm(choices.length > 1)
    setFull(choices.length >= max)
  }, [choices, setCanConfirm, setFull])

  const toggleCompare = () => {
    console.log('toggling compare, current value', compare)
    console.log('choices value', choices)
    setCompare(e => !e)
    setChoices([])
  }
  const handleChoice = (add, clicked) => {
    console.log('something was picked, choices', choices)
    console.log('Add', add)
    console.log('clicked', clicked)
    if (add) {
      setChoices(c => { c.push(clicked); return [...c] })
    } else {
      setChoices(c => c.toSpliced(c.indexOf(clicked), 1))
    }
  }

  const handleCompare = () => {
    setToCompare(choices)
    navigate('/compare')
  }

  if (searchType === 'reviewer') {
    return (
      <div className='results-pane'>
        {results && results.map((result, index) => {
          return <StudentResult key={index} result={result} handleChoice={handleChoice} />
        })}
      </div>
    )
  }

  return (
    <div>
      <div className='results-pane'>
        {results && results.map((result) => {
          return <Result key={result.id} result={result} compare={compare} full={full} handleChoice={handleChoice} />
        })}
      </div>
      <div className='results-footer'>
        <button className='compare-button' onClick={toggleCompare}>{compare ? 'Cancel' : 'Compare'}</button>
        {compare && <button className='compare-button' onClick={handleCompare} disabled={!canConfirm}>Confirm</button>}
      </div>
    </div>
  )
}

export default Results
