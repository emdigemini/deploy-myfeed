import { useState, useEffect, useContext } from "react"
import { PostContext } from "./PostContext"

export function PostCard(){
  const {postData, setPostData} = useContext(PostContext);
  
  return (
    <>
      {postData.map(post => {
        const date = new Date(post.timestamp).toLocaleDateString("en-us", {
          year: "numeric", 
          month: "short", 
          day: "numeric", 
        });

        const time = new Date(post.timestamp).toLocaleTimeString("en-us", {
          hour: "2-digit", 
          minute: "2-digit", 
          hour12: true
        })

        return (
          <div key={post.timestamp} className="post-card">
            <div className="post-text"
              style={{ fontSize: `${post.fontSize}px` }}
            >
              {post.postText}
            </div>
            <p className="date-posted">{date} at {time}</p>
            <PostMedia mediaFiles={post.mediaFiles} />
            <div className="post-interactions">
              <i className="bi bi-heart"></i>
              <i className="bi bi-chat"></i>
              <i className="bi bi-star"></i>
            </div>
          </div>
        )
      })}
    </>
  )
}

function PostMedia({mediaFiles}){
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const newUrls = mediaFiles.map(file => URL.createObjectURL(file));
    setUrls(newUrls);

    return () => newUrls.forEach(url => URL.revokeObjectURL(url));
  }, [mediaFiles]);
  return (
    <>
      {urls.map((url, i) => {
        return (
          <div key={`${mediaFiles[i].name}-${i}`} className="post-media">
            <img src={url} alt={mediaFiles[i].name} /> 
          </div>
        )
      })}
    </>
  )
}