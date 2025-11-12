export function MyProfile(){
  return (
    <div className="my-profile">
      <div className="cover-photo">

      </div>
      <div className="profile-card">
        <div className="profile-photo">
          <div className="my-profile">
            {/* DITO PICTURE */}
            <img src="icons/me_0.jpg" alt="ME" />
          </div>
          <p>Emdi</p>
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
          <div className="photo-count">
            <label htmlFor="">Photos</label>
            <p>35</p>
          </div>

          <div className="post-count">
            <label htmlFor="">Posts</label>
            <p>101</p>
          </div>
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
    </div>
  )
}