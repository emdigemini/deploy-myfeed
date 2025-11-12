import "@fontsource/montserrat/600.css"
import "@fontsource/montserrat/800.css"
import { useEffect, useState, useRef } from "react";

export function Header(){
  const [showToggle, setShowToggle] = useState(false);
  const menuRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const closeSideMenu = (e) => {
      if(!showToggle)
        return;
      if(gridRef.current && gridRef.current.contains(e.target))
        return;
      if(menuRef.current && !menuRef.current.contains(e.target)){
        menuRef.current.classList.add('close');
        menuRef.current.addEventListener('animationend', () => {
          setShowToggle(false)
        }, {once: true})
      }
    }

    document.addEventListener('click', closeSideMenu);
    return () => document.removeEventListener('click', closeSideMenu);
  }, [showToggle])

  return (
    <header>
      <div className="header-name">
        <div className="app-icon">
          <img className="app-logo" src="icons/my-feed.svg" alt="M" />
        </div>
        <p>MY FEED</p>
      </div>
      <div ref={gridRef} onClick={() => setShowToggle(true)} className="menu-bar">
        <i className="bi bi-grid-3x3-gap"></i>
      </div>
      {showToggle && <SideMenu showToggle={showToggle} menuRef={menuRef} />}
    </header>
  );
}

function SideMenu({ showToggle, menuRef }){
  return (
    <div ref={menuRef} className={`sidebar ${
      showToggle ? 'in' : ''
    }`}>
      <button>PROFILE</button>
      <button>ALL POSTS</button>
      <button>GALLERY</button>
      <button>FAVORITES</button>
      <button>FEEDBACK</button>
      <button>ABOUT</button>
      <button>LOG OFF</button>
    </div>
  )
}