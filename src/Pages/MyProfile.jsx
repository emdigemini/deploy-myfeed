import DOMPurify from 'dompurify';
import parse from 'html-react-parser'
import { useContext, useEffect, useRef, useState } from "react"
import { PostContext } from "../components/PostContext"
import { getUserData, manageUserProfile } from '../utils/db';

export function MyProfile(){
  const [ userProfile, setUserProfile ] = useState([]);
  const [ profilePhoto, setProfilePhoto ] = useState([]);
  const [ isEditing, setIsEditing ] = useState(false);

  useEffect(() => {
    async function fetchUserData(){
      let userData = await getUserData();
      if(!userData || userData.length === 0){
        userData = [{
          nickname: 'nickname', 
          name: 'Emdi Gemini', 
          bdate: 'June 5, 2005', 
          about: 'How would you describe yourself?'
        }]
      }
      setUserProfile(userData);
    }
    fetchUserData();
  }, [])

  const editProfile = () => {
    setIsEditing(!isEditing);
  }

  return (
    <div className="my-profile">
      {!isEditing 
      ? (
        <PROFILE_PREVIEW editProfile={editProfile} userProfile={userProfile} />
      )
      : (
        <EDIT_PROFILE editProfile={editProfile} userProfile={userProfile} setUserProfile={setUserProfile} />
      )}
      
    </div>
  )
}

function PROFILE_PREVIEW({ editProfile, userProfile }){
  const [ photoURL1, setPhotoURL1 ] = useState([]); 
    
  useEffect(() => {
    if(userProfile.length === 0) return;
    let newPhoto;
    const userWithFilePhoto = userProfile.find(
      user => user.profilePhoto && user.profilePhoto.length > 0
    );

    newPhoto = userWithFilePhoto
      ? URL.createObjectURL(userWithFilePhoto.profilePhoto[0])
      : 'images/default-profile.jpg';

    setPhotoURL1(newPhoto);

    return () => {
      if(userWithFilePhoto) URL.revokeObjectURL(newPhoto);
    };
  }, [userProfile]);
  
  return (
    <>
    {userProfile.map((info, i) => {
      const bdate = new Date(info.bdate).toLocaleDateString('en-us', {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      });
        return <div key={i}>
          <div className="cover-photo">

          </div>
          <div className="profile-card">
            <div className="profile-photo">
              
              <div className="my-profile">
                {/* DITO PICTURE */}
                {photoURL1
                ? <img src={photoURL1} alt="ME" />
                : <img src="images/default-profile" alt="" />}
              </div>
              <p>{info.nickname}</p>
              <i onClick={editProfile} className="bi bi-pencil-square"></i>
            </div>
            <div className="info-card">
              <div className="name-data">
                <label htmlFor="">My Name</label>
                <p>{info.name || 'Name here'}</p>
              </div>

              <div className="bday-data">
                <label htmlFor="">My Birthday</label>
                <p>{bdate || 'January 1, 2000'}</p>
              </div>
            </div>

            <div className="info-card2">
              <CountPost />
            </div>

            <div className="about-card">
              <div className="about-data">
                <label htmlFor="">Who I Am</label>
                <p>{info.about === '<br>' 
                ? "Who are you when the noise fades? When it's quiet… do you finally recognize yourself?" 
                : parse(DOMPurify.sanitize(info.about))}</p>
              </div>
            </div>
            

            <div className="created-date">
              <label htmlFor="">Created</label>
              <p>December 10, 2025</p>
            </div>
          </div>
        </div>
    })}
    </>
  )
}

function EDIT_PROFILE({ editProfile, userProfile, setUserProfile }){
  const [ coverPhoto, setCoverPhoto ] = useState(null);
  const [ profilePhoto, setProfilePhoto ] = useState(null);
  const [ photoURL1, setPhotoURL1 ] = useState([]); 

  const nicknameRef = useRef(null);
  const nameRef = useRef(null);
  const bdateRef = useRef(null);
  const aboutRef = useRef(null);
  const photo1 = useRef(null);
  const photo2 = useRef(null);

  const changePhoto = (type) => {
    const files = type === 'cover' ? photo1.current.files : photo2.current.files;
    if(files.length === 0) return;

    const url = URL.createObjectURL(files[0]);
      if(type === 'cover') setCoverPhoto(url);
      else setProfilePhoto(url);
    };

    const saveInfo = () => {
      const currentProfile = userProfile[0];
      console.log(currentProfile.profilePhoto);
      const coverPhoto = Array.from(photo1.current.files);
      const profilePhoto = Array.from(photo2.current.files);
      const id = 'user';
      const nickname = nicknameRef.current.textContent;
      const name = nameRef.current.value;
      const about = aboutRef.current.innerHTML
        .replaceAll('<div>', '<br>')
        .replaceAll('</div>', '');
      const bdate = bdateRef.current.value;

      const updatedProfile = { id, nickname, name, bdate, about, 
        coverPhoto: coverPhoto || 'images/default-cover.jpg', 
        profilePhoto: profilePhoto || (currentProfile && currentProfile.profilePhoto) || 'images/default-profile.jpg' };

      if (coverPhoto.length > 0) updatedProfile.coverPhoto = coverPhoto;
      if (profilePhoto.length > 0) updatedProfile.profilePhoto = profilePhoto;

      setUserProfile([updatedProfile]);
      manageUserProfile(updatedProfile);
      editProfile();
  };

  useEffect(() => {
    if(userProfile.length === 0) return;
    let newPhoto;
    const userWithFilePhoto = userProfile.find(
      user => user.profilePhoto && user.profilePhoto.length > 0
    );

    newPhoto = userWithFilePhoto
      ? URL.createObjectURL(userWithFilePhoto.profilePhoto[0])
      : 'images/default-profile.jpg';

    setPhotoURL1(newPhoto);

    return () => {
      if(userWithFilePhoto) URL.revokeObjectURL(newPhoto);
    };
  }, [userProfile])


  return (
    <>
      {userProfile.map((info, i) => {
        return <div key={i}>
        <div className="cover-photo">
          {<img
            src={coverPhoto || info.coverPhoto || 'images/default-cover.jpg'}
            alt="ME"
          />}
          <input 
           ref={photo1}
           onChange={() => changePhoto('cover')}
           type="file"
           accept='image/*'
           style={{
            display: 'none'
           }} />
          <i onClick={() => photo1.current.click()} className="bi bi-card-image"></i>
        </div>
        <div className="profile-card">
          <div className="profile-photo">
            
            <div className="my-profile">
              {/* DITO PICTURE */}
              <input 
                ref={photo2}
                onChange={() => changePhoto('profile')}
                type="file"
                accept='image/*'
                style={{
                  display: 'none'
                }} />
              <img
                src={profilePhoto || photoURL1 || 'images/default-profile.jpg'}
                alt="ME"
              />
              <i onClick={() => photo2.current.click()} className="bi bi-image-fill"></i>
            </div>
            <p 
            contentEditable={true}
            suppressContentEditableWarning
            style={{
              borderBottom: "1px solid black"
            }}
            ref={nicknameRef}
            className="nickname"
            >{info.nickname}</p>
            <i onClick={saveInfo} className="bi bi-check2-square"></i>
          </div>
          <div className="info-card">
            <div className="name-data">
              <label htmlFor="">My Name</label>
              <input type="text" ref={nameRef}
              defaultValue={info.name}
                placeholder="Your Name"
                className="name" />
            </div>

            <div className="bday-data">
              <label htmlFor="">My Birthday</label>
              <input type="date" ref={bdateRef}
              defaultValue={info.bdate}
              placeholder="Your Birthdate"
              className="birthdate" />
            </div>
          </div>

          <div className="info-card2">
            <CountPost />
          </div>

          <div className="about-card">
            <div className="about-data">
              <label htmlFor="">Who I Am</label>
              <p contentEditable 
              suppressContentEditableWarning
              ref={aboutRef}
              className="about"
              >{info.about === '<br>' 
                ? "How would you describe yourself?" 
                : parse(DOMPurify.sanitize(info.about))}</p>
            </div>
            <span>0/350</span>
          </div>
          

          <div className="created-date">
            <label htmlFor="">Created</label>
            <p>December 10, 2025</p>
          </div>
        </div>
        </div>
      })}
    </>
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