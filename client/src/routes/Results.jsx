import React, { useEffect, useState } from 'react';
import Result from '../components/Result';

function Results({searchResults}) {
  const [choice, setChoice] = useState(null)
  const [results, setResults] = useState(searchResults)

  useEffect(() => {
    setResults(searchResults)
  },[setResults, searchResults])

  const handleChoice = (query) => {
    // TODO: search professors
    // setSearchResults(/* search results */);
  }

  return (
    <div>
        {searchResults && searchResults.map((result,index) => {
            return <Result key={index} result={result} setChoice={setChoice}/>
        })}
    </div>
  );
}

export default Results