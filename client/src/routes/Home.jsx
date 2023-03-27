import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

function Home({setSearchResults}) {
  const [professors, setProfessors] = useState([])

  useEffect(() => {
    fetch ('http://localhost:3001/api/v1/professors',{
        method:'GET',
        headers:{"Content-Type":"application/json"}})
        .then((response)=>{return response.json()})
        .then(data => {
            console.log(data)
            setProfessors(data)
        })
  },[])

  const handleSearch = (query) => {
    // TODO: search professors

    setSearchResults(/* search results */);
  }

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      {/* Display search results */}
    </div>
  );
}

export default Home