import { useState, useEffect, useContext, useRef } from "react"
import { deletePost } from "../utils/db";
import { PostContext } from "./PostContext"

export function PostCard(){
  const { postData } = useContext(PostContext);
  const [activeControlId, setActiveControlId] = useState();
  const controlRef = useRef(null);

  const closeControl = (e) => {
    if(!activeControlId) return;
    console.log('hello');
    console.log(e.target);
  }

  function controlPost(id){
    if(activeControlId === id){
      setActiveControlId(null);
    } else {
      setActiveControlId(id);
    }
  }

  return (
    <>
      {postData.map(post => {
        const postDate = new Date(post.timestamp);
        const date = postDate.toLocaleDateString("en-us", {
          year: "numeric", 
          month: "short", 
          day: "numeric", 
        });

        const time = postDate.toLocaleTimeString("en-us", {
          hour: "2-digit", 
          minute: "2-digit", 
          hour12: true
        })

        return (
          <div key={post.id} className="post-card">
            <div className="control-post">
              <i aria-label="Control post"
              onClick={() => controlPost(post.id)}
              className="bi bi-three-dots"></i>
              {activeControlId === post.id ? <PostControl controlRef={controlRef} id={post.id} /> : ''}
            </div>
            <div className="post-text"
              style={{ fontSize: `${post.fontSize}px` }}
            >
              {post.postText ? <p>{post.postText}</p> : ''}
            </div>
            <p className="date-posted">{date} at {time}</p>
            <PostMedia mediaFiles={post.mediaFiles} id={post.id} />
            <div className="post-interactions">
              <i aria-label="Like post" className="bi bi-heart"></i>
              <i aria-label="Comment post" className="bi bi-chat"></i>
              <i aria-label="Favorite post" className="bi bi-star"></i>
            </div>
          </div>
        )
      })}
    </>
  )
}

function PostControl({ controlRef, id }){
  const { postData, setPostData } = useContext(PostContext);

  function delPost(){
    console.log(id);
    const select = postData.filter(post => post.id === id);
    const updatedPost = select.map(post => deletePost(post.id));
    setPostData(updatedPost);
  }

  return (
    <div ref={controlRef} className="post-control">
      <ul>
        <li>Edit</li>
        <li onClick={delPost} >Delete</li>
      </ul>
    </div>
  )
}

function PostMedia({ mediaFiles, id }){
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const files = mediaFiles;
    const newUrls = files.map(file => URL.createObjectURL(file));
    setUrls(newUrls);
    return () => newUrls.forEach(url => URL.revokeObjectURL(url));
  }, [mediaFiles]);

  return (
    <>
      {urls.map((url, i) => {
        return (
          <div key={id+i} className="post-media">
            <img src={url} alt={mediaFiles[i].name} /> 
          </div>
        )
      })}
    </>
  )
}