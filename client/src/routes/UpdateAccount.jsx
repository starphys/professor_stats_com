import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function UpdateAccount ({ token, setToken }) {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(token.first_name)
  const [lastName, setLastName] = useState(token.last_name)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()

    setPasswordMismatch(false)
    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }

    const student = { first_name: firstName, last_name: lastName, password, verified: false }
    fetch(`http://localhost:3001/api/v1/students/${token.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setToken(data.student)
          navigate(`/user/${token.username}`)
        }
      })
  }

  if (token === null) {
    navigate('/')
  }

  return (
    <div className='signup-container'>
      <h1 className='signup-header'>Create Account</h1>
      <form onSubmit={handleSignup} className='signup-form'>
        <div className='signup-form-group'>
          <label htmlFor='firstName' className='signup-label'>First Name:</label>
          <input
            type='text'
            id='firstName'
            className='signup-input'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className='signup-form-group'>
          <label htmlFor='lastName' className='signup-label'>Last Name:</label>
          <input
            type='text'
            id='lastName'
            className='signup-input'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        <div className='signup-form-group'>
          <label htmlFor='confirmPassword' className='signup-label'>Confirm Password:</label>
          <input
            type='password'
            id='confirmPassword'
            className='signup-input'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {passwordMismatch && (
          <div className='signup-password-mismatch'>
            Passwords do not match.
          </div>
        )}
        <button type='submit' className='signup-button'>Update Account</button>
        <button className='review-professor-button-red' onClick={() => navigate(`/user/${token.username}`)}>Cancel</button>
      </form>
    </div>
  )
}

export default UpdateAccount
