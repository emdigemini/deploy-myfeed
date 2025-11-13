import { useContext, useRef, useState } from "react"
import { PostContext } from "../components/PostContext"

export function MyProfile(){
  const [ isEditing, setIsEditing ] = useState(false);

  const editProfile = () => {
    setIsEditing(!isEditing);
  }

  return (
    <div className="my-profile">
      {!isEditing 
      ? (
        <>
        <div className="cover-photo">

        </div>
        <div className="profile-card">
          <div className="profile-photo">
            
            <div className="my-profile">
              {/* DITO PICTURE */}
              <img src="icons/me_0.jpg" alt="ME" />
            </div>
            <p>Emdi</p>
            <i onClick={editProfile} className="bi bi-pencil-square"></i>
          </div>
          <div className="info-card">
            <div className="name-data">
              <label htmlFor="">My Name</label>
              <p>Dhenmark Opana</p>
            </div>

            <div className="bday-data">
              <label htmlFor="">My Birthday</label>
              <p>June 5, 2005</p>
            </div>
          </div>

          <div className="info-card2">
            <CountPost />
          </div>

          <div className="about-card">
            <div className="about-data">
              <label htmlFor="">Who I Am</label>
              <p>How would you describe yourself?</p>
            </div>
          </div>
          

          <div className="created-date">
            <label htmlFor="">Created</label>
            <p>December 10, 2025</p>
          </div>
        </div>
        </>
      )
      : (
        <>
        <div className="cover-photo">

        </div>
        <div className="profile-card">
          <div className="profile-photo">
            
            <div className="my-profile">
              {/* DITO PICTURE */}
              <img src="icons/me_0.jpg" alt="ME" />
            </div>
            <p 
            contentEditable
            suppressContentEditableWarning
            >Emdi</p>
            <i onClick={editProfile} className="bi bi-check2-square"></i>
          </div>
          <div className="info-card">
            <div className="name-data">
              <label htmlFor="">My Name</label>
              <input type="text" placeholder="Your Name" />
            </div>

            <div className="bday-data">
              <label htmlFor="">My Birthday</label>
              <input type="date" placeholder="Your Birthdate" />
            </div>
          </div>

          <div className="info-card2">
            <CountPost />
          </div>

          <div className="about-card">
            <div className="about-data">
              <label htmlFor="">Who I Am</label>
              <p contentEditable suppressContentEditableWarning>How would you describe yourself?</p>
            </div>
            <span>0/350</span>
          </div>
          

          <div className="created-date">
            <label htmlFor="">Created</label>
            <p>December 10, 2025</p>
          </div>
        </div>
        </>
      )}
      
    </div>
  )
}

function CountPost(){
  const { postData } = useContext(PostContext);
  const photosCount = postData.reduce((count, post) => count + post.mediaFiles.length, 0);
  return (
    <>
      <div className="photo-count">
        <label htmlFor="">Photos</label>
        <p>{photosCount}</p>
      </div>
      <div className="post-count">
        <label htmlFor="">Posts</label>
        <p>{postData.length}</p>
      </div>
    </>
  )
}
function ProfileEditor(){
}