import React from 'react'
import MentorSuggest from '../ShowMentors/MentorSuggest/MentorSuggest'
import "./Welcome.css"
import Welcome from './Welcome/WelcomeHeader'

function MenteeWelcome() {
  return (
    <div className='mentee-welcome'>
        
        <Welcome/>
        <MentorSuggest />
    </div>
  )
}

export default MenteeWelcome
