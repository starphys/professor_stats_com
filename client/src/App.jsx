import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import CreateAccount from './routes/CreateAccount'
import Home from './routes/Home'
import LoginPage from './routes/LoginPage'
import AccountPage from './routes/AccountPage'
import ComparePage from './routes/ComparePage'
import ProfessorPage from './routes/ProfessorPage'
import Results from './routes/Results'
import './styles/App.css'

export const LabelsContext = createContext(['Overall', 'Goodness', 'Greatness', 'Exceptionality', 'Bestness', 'Praiseworthiness'])
export const TokenContext = createContext(null)

const App = () => {
  // TODO: persist global state in localStorage
  // TODO: OPTIONAL move global state to context instead of prop driling
  const [searchResults, setSearchResults] = useState(JSON.parse(localStorage.getItem('searchResults')) || [])
  const [searchType, setSearchType] = useState('')
  const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem('userToken')) || null)
  const [toCompare, setToCompare] = useState(JSON.parse(localStorage.getItem('toCompare')) || [])

  useEffect(() => {
    localStorage.setItem('userToken', JSON.stringify(userToken))
  }, [userToken])

  useEffect(() => {
    localStorage.setItem('searchResults', JSON.stringify(searchResults))
  }, [searchResults])

  useEffect(() => {
    localStorage.setItem('toCompare', JSON.stringify(toCompare))
  }, [toCompare])

  return (
    <LabelsContext.Provider value={['Overall', 'Goodness', 'Greatness', 'Exceptionality', 'Bestness', 'Praiseworthiness']}>
      <TokenContext.Provider value={[userToken, setUserToken]}>
        <Router>
          <Navbar token={userToken} setUserToken={setUserToken} />
          <Routes>
            <Route exact path='/' element={<Home setSearchResults={setSearchResults} setSearchType={setSearchType} />} />
            <Route exact path='/signup' element={<CreateAccount setUserToken={setUserToken} />} />
            <Route exact path='/login' element={<LoginPage setUserToken={setUserToken} />} />
            <Route exact path='/results' element={<Results searchResults={searchResults} searchType={searchType} setToCompare={setToCompare} />} />
            <Route exact path='/professor/:id' element={<ProfessorPage token={userToken} />} />
            <Route exact path='/user/:username' element={<AccountPage token={userToken} />} />
            <Route exact path='/compare' element={<ComparePage toCompare={toCompare} />} />

          </Routes>
        </Router>
      </TokenContext.Provider>
    </LabelsContext.Provider>
  )
}

export default App
