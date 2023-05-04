import React, { useState } from 'react'

// Component to collect user input for search
function SearchBar ({ onSearch }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(query, category)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Search for a professor'
        value={query}
        onChange={e => { setQuery(e.target.value) }}
        className='search-text'
      />
      <select value={category} onChange={e => setCategory(e.target.value)} className='search-select'>
        <option disabled value=''> -- Search By -- </option>
        <option value='professor'>Professor</option>
        <option value='course'>Course</option>
        <option value='reviewer'>Reviewer</option>
      </select>
      <button className='search-button' type='submit'>Search</button>
    </form>
  )
}

export default SearchBar
