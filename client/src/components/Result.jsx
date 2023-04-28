import React from 'react'
import SpiderChart from './SpiderChart'

function Result ({ result, handleChoice }) {
  const qualities = [result.overall, result.quality1, result.quality2, result.quality3, result.quality4, result.quality5].map(e => e / 100)
  console.log(result)
  return (
    <div className='search-result' onClick={() => handleChoice(result)}>
      <img src={`${process.env.PUBLIC_URL}/images/${result.id}.jpg`} alt={`${result.first_name} ${result.last_name}`} />
      <p>{`${result.first_name} ${result.last_name}, ${result.degrees}`}</p>
      <SpiderChart data1={{ values: qualities, label: 'All courses' }} style={{ height: 100, width: 100 }} detail={false} />
    </div>
  )
}

export default Result
