  import "@fontsource/montserrat/600.css"
  import "@fontsource/montserrat/800.css"
  import { useEffect, useRef } from "react"
  import { useNavigate } from 'react-router-dom'

  export function Startup(){
      const navigate = useNavigate();
      useEffect(() => {
        const timer = setTimeout(() => {
          navigate("/home/myfeed", {replace: true});
        }, 5000);

        return () => clearTimeout(timer);
      }, [navigate])

    return (
      <div className="loading-screen">
        <div className="loading-name">
          <div
            className="app-icon">
            <img className="app-logo" src="icons/my-feed.svg" alt="M" />
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