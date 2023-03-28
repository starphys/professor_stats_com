import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function Login () {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <button type='submit' className='signup-button' onClick={handleLogin}>Login</button>
  )
}

export default Login
