import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function CreateAccount ({ setUserToken }) {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [usernameInUse, setUsernameInUse] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()
    setUsernameInUse(false)
    setPasswordMismatch(false)
    setInvalidEmail(false)
    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }
    if (!studentEmail.includes('@sjsu.edu')) {
      setInvalidEmail(true)
      return
    }

    const student = { first_name: firstName, last_name: lastName, email: studentEmail, username, password, verified: false }
    fetch('http://localhost:3001/api/v1/students', {
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
          setUsernameInUse(true)
        }
      })
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
          <label htmlFor='studentEmail' className='signup-label'>Student Email:</label>
          <input
            type='email'
            id='studentEmail'
            className='signup-input'
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
          />
        </div>
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
        {usernameInUse && (
          <div className='signup-password-mismatch'>
            Selected username is already in use!
          </div>
        )}
        {invalidEmail && (
          <div className='signup-password-mismatch'>
            Please signup with a valid SJSU email.
          </div>
        )}
        <button type='submit' className='signup-button'>Sign up</button>
      </form>
    </div>
  )
}

export default CreateAccount
