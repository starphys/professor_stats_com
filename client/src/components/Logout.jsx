import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function Logout ({ setUserToken }) {
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    setUserToken(null)
    navigate('/')
  }

  return (
    <button type='submit' className='logout-button' onSubmit={handleLogout}>Logout</button>
  )
}

export default Logout
