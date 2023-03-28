import React, { useEffect, useState } from 'react'

const ProfessorPage = ({ professor }) => {
  useEffect((
    // fetch the appropriate professor
  ) => {}, [professor])

  return (
    <div className='prof-page'><b>{`${professor.first_name} ${professor.last_name}`}</b></div>
  )
}

export default ProfessorPage
