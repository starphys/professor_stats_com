import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import '../styles/App.css'

function Home ({ setSearchResults }) {
  const navigate = useNavigate()
  const [professors, setProfessors] = useState([])
  const [found, setFound] = useState('Start')

  // For now, we can manage search in the frontend
  useEffect(() => {
    fetch('http://localhost:3001/api/v1/professors', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((response) => { return response.json() })
      .then(data => setProfessors(data.professors))
  }, [])

  const handleSearch = (query) => {
    // For now, this only searches by professor
    setFound('Searching')
    const results = professors.filter((professor) => {
      if (professor.first_name.toLowerCase().includes(query.toLowerCase())) { return true }
      if (professor.last_name.toLowerCase().includes(query.toLowerCase())) { return true }
      return false
    })
    if (results.length < 1 || query.length < 1) {
      setFound('Not found')
    } else {
      setFound('Found')
      setSearchResults(results)
      navigate('/results')
    }
  }

  return (
    <div className='search-page'>
      <SearchBar onSearch={handleSearch} />
      {found === 'Not found' && <b>No results found, please try another search term.</b>}
    </div>
  )
}

export default Home
