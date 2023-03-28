import React from 'react'

function Result ({ result, handleChoice }) {
  return (
    <div onClick={() => handleChoice(result)}>
      <p>{`${result.first_name} ${result.last_name}`}</p>
    </div>
  )
}

export default Result
