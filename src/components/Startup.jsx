import "@fontsource/montserrat/600.css"
import "@fontsource/montserrat/800.css"
import { useEffect, useRef } from "react"
import { Navigate } from 'react-router-dom'

export function Startup(){
  useEffect(() => {
    setTimeout
  })

  return (
    <div className="loading-screen">
      <div className="loading-name">
        <div
          className="app-icon">
          <img className="app-logo" src="../../public/icons/my-feed.svg" alt="M" />
        </div>
        <div className="app-name">
            MY FEED
        </div>
      </div>
      <p className="loading-paragraph">
        No rules, no pressure, just you and your words.
      </p>
      <p>
        This is offline mode and your thoughts are safe here.
      </p>
    </div>    
  )
}