import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function LoginPage ({ setUserToken }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: hash passwords
    setInvalidCredentials(false)
    const student = { username, password }
    fetch('http://localhost:3001/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setUserToken(data.student)
          navigate('/')
        } else {
          setInvalidCredentials(true)
        }
      })
  }

  return (
    <div className='signup-container'>
      <h1 className='signup-header'>Login</h1>
      <form onSubmit={handleLogin} className='signup-form'>
        <div className='signup-form-group'>
          <label htmlFor='username' className='signup-label'>Username:</label>
          <input
            type='text'
            id='username'
            className='signup-input'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='signup-form-group'>
          <label htmlFor='password' className='signup-label'>Password:</label>
          <input
            type='password'
            id='password'
            className='signup-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {invalidCredentials && (
          <div className='signup-password-mismatch'>
            Username or password is incorrect
          </div>
        )}
        <button type='submit' className='signup-button'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage
