import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DeleteAccountButton ({ token, setToken }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleDelete = (e) => {
    fetch(`http://localhost:3001/api/v1/students/${token.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => { console.log(response); return response.json() })
      .then(data => {
        console.log(data)
        setToken(null)
        navigate('/')
      })
  }

  return (
    <div className='account-button-item'>
      {open ? <button className='review-professor-button-red' onMouseLeave={() => setOpen(false)} onClick={handleDelete}>Confirm Delete</button> : <button className='review-professor-button' onMouseLeave={() => setOpen(false)} onClick={() => setOpen(true)}>Delete Account</button>}
    </div>
  )
}

export default DeleteAccountButton
