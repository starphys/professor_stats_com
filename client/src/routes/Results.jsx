import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Result from '../components/Result'
import '../styles/App.css'

function Results ({ searchResults, setProfessor }) {
  const navigate = useNavigate()

  const [results, setResults] = useState(searchResults)

  useEffect(() => {
    setResults(searchResults)
  }, [setResults, searchResults])

  const handleChoice = (clicked) => {
    setProfessor(clicked)
    navigate(`/professor/${clicked.id}`)
  }

  return (
    <div className='results-page'>
      {results && results.map((result, index) => {
        return <Result key={index} result={result} handleChoice={handleChoice} />
      })}
    </div>
  )
}

export default Results
