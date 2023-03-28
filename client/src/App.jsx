import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import ProfessorPage from './routes/ProfessorPage'
import Results from './routes/Results'
import ReviewPage from './routes/ReviewPage'

const App = () => {
  const [searchResults, setSearchResults] = useState([])
  const [professor, setProfessor] = useState(null)
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home setSearchResults={setSearchResults} />} />
        <Route exact path='/results' element={<Results searchResults={searchResults} setProfessor={setProfessor} />} />
        <Route exact path='/professor/:id' element={<ProfessorPage professor={professor} />} />
        <Route exact path='/review' element={<ReviewPage />} />
      </Routes>
    </Router>
  )
}

export default App
