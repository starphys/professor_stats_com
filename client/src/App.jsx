import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import CreateAccount from './routes/CreateAccount'
import Home from './routes/Home'
import LoginPage from './routes/LoginPage'
import AccountPage from './routes/AccountPage'
import ProfessorPage from './routes/ProfessorPage'
import Results from './routes/Results'
import ReviewPage from './routes/ReviewPage'
import './styles/App.css'

export const LabelsContext = createContext(['Overall', 'Goodness', 'Greatness', 'Exceptionality', 'Bestness', 'Praiseworthiness'])

const App = () => {
  // TODO: persist global state in localStorage
  // TODO: OPTIONAL move global state to context instead of prop driling
  const [searchResults, setSearchResults] = useState([])
  const [professor, setProfessor] = useState(null)
  const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userToken')) || null)

  useEffect(() => {
    console.log('User token updated')
    console.log(userToken)
    localStorage.setItem('userToken', JSON.stringify(userToken))
  }, [userToken])

  return (
    <LabelsContext.Provider value={['Overall', 'Goodness', 'Greatness', 'Exceptionality', 'Bestness', 'Praiseworthiness']}>
      <Router>
        <Navbar token={userToken} setUserToken={setUserToken} />
        <Routes>
          <Route exact path='/' element={<Home setSearchResults={setSearchResults} />} />
          <Route exact path='/signup' element={<CreateAccount setUserToken={setUserToken} />} />
          <Route exact path='/login' element={<LoginPage setUserToken={setUserToken} />} />
          <Route exact path='/results' element={<Results searchResults={searchResults} setProfessor={setProfessor} />} />
          <Route exact path='/professor/:id' element={<ProfessorPage token={userToken} professor={professor} />} />
          <Route exact path='/review' element={<ReviewPage />} />
          <Route exact path='/user/:username' element={<AccountPage token={userToken} />} />
        </Routes>
      </Router>
    </LabelsContext.Provider>
  )
}

export default App
