import React, { useState } from 'react'

// Component to collect user input for search
function SearchBar ({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Search for a professor'
        value={query}
        onChange={e => { setQuery(e.target.value) }}
      />
      <button type='submit'>Search</button>
    </form>
  )
}

export default SearchBar
