import "@fontsource/montserrat/600.css"
import "@fontsource/montserrat/800.css"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function Header(){
  const navigate = useNavigate();
  const [showToggle, setShowToggle] = useState(false);
  const menuRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const menuHandler = (e) => {
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

    document.addEventListener('click', menuHandler);
    return () => document.removeEventListener('click', menuHandler);
  }, [showToggle]);

  return (
    <header>
      <div className="header-name"
      onClick={() => navigate('/home/myfeed')}
      >
        <div className="app-icon">
          <img className="app-logo" src="icons/my-feed.svg" alt="M" />
        </div>
        <p>MY FEED</p>
      </div>
      <div ref={gridRef} onClick={() => setShowToggle(true)} className="menu-bar">
        <i className="bi bi-grid-3x3-gap"></i>
      </div>
      {showToggle && <SideMenu showToggle={showToggle} menuRef={menuRef} 
        setShowToggle={setShowToggle}
      />}
    </header>
  );
}

function SideMenu({ showToggle, menuRef, setShowToggle }){
  const navigate = useNavigate();
  function nav(link){
    navigate(link);
    menuRef.current.classList.add('close');
    menuRef.current.addEventListener('animationend', () => {
      setShowToggle(false)
    }, {once: true})
  }
  return (
    <div ref={menuRef} className={`sidebar ${
      showToggle ? 'in' : ''
    }`}>
      <div className="buttons">
        <button onClick={() => nav('/home/myprofile')}>PROFILE</button>
        <button>ALL POSTS</button>
        <button>GALLERY</button>
        <button>FAVORITES</button>
        <button>FEEDBACK</button>
        <button>ABOUT</button>
        <button>LOG OFF</button>
      </div>
    </div>
  )
}