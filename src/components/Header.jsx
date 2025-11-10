import "@fontsource/montserrat/600.css"
import "@fontsource/montserrat/800.css"

export function Header(){
  return (
    <header>
      <div className="header-name">
        <div className="app-icon">
          <img className="app-logo" src="../../public/icons/my-feed.svg" alt="M" />
        </div>
        <p>MY FEED</p>
      </div>
      <div className="menu-bar">
        <i className="bi bi-grid-3x3-gap"></i>
      </div>
    </header>
  );
}