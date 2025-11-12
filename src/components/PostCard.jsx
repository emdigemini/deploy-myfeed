import DOMPurify from 'dompurify';
import parse from 'html-react-parser'
import { useState, useEffect, useContext, useRef } from "react"
import { managePost } from "../utils/db";
import { PostContext } from "./PostContext"

export function PostCard(){
  const { postData } = useContext(PostContext);
  const [activeControlId, setActiveControlId] = useState();
  const controlRef = useRef(null);


  useEffect(() => {
    const closeControl = (e) => {
      if(!activeControlId) return;
      if(controlRef.current 
        && controlRef.current.contains(e.target)){
        return;
      }
        setActiveControlId(null);
    }
    document.addEventListener('click', closeControl);
    return () => document.removeEventListener('click', closeControl);
  }, [activeControlId])

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
              onClick={(e) => {
                e.stopPropagation();
                controlPost(post.id);
              }}
              className="bi bi-three-dots"></i>
              {activeControlId === post.id ? <PostControl controlRef={controlRef} id={post.id} /> : ''}
            </div>
            <PostText text={post.postText} fontSize={post.fontSize} />
            <p className="date-posted">{date} at {time}</p>
            <PostMedia mediaFiles={post.mediaFiles} id={post.id} />
            <PostInteraction id={post.id} like={post.like} comment={post.comment} favorite={post.favorite} />
          </div>
        )
      })}
      {postData.length === 0 && (
        <p className='empty-state'>Your feed is empty. Let today's thoughts live here.</p>
      )}
    </>
  )
}

function PostText({ text, fontSize }){
  const [showToggle, setShowToggle] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if(textRef.current && textRef.current.scrollHeight > 250){
      setShowToggle(true);
    } 
  }, [text]);

  return (
    <div className={`post-text ${!isExpanded
        ? '' : 'expanded'}
      `}
      style={{ fontSize: `${fontSize}px` }}
    >
      {text.length > 0 
      ? <p ref={textRef} >{parse(DOMPurify.sanitize(text))}</p> 
      : ''}
      {showToggle === true && <p className='see-more-toggle' 
      onClick={() => setIsExpanded(!isExpanded)}>
      {!isExpanded && '...See More'}</p>}
      {isExpanded && <p className='see-less-toggle' 
      onClick={() => setIsExpanded(!isExpanded)} >
      ...See Less
      </p>}
    </div>
  )
}

function PostInteraction({ id, like, comment, favorite }){
  const { postData, setPostData } = useContext(PostContext);

  function postToLike(){
    const updatedPost = postData.map(post => {
      if (post.id !== id) return post;
      const newLike = !post.like;
      managePost({ ...post, like: newLike }, 'interact')
        .then(() => console.log(`Post ${newLike ? 'liked' : 'like removed'}.`))
        .catch(err => console.log('Failed to interact with post.', err));

      return { ...post, like: newLike };
    });
    setPostData(updatedPost)
  }

  function postToFavorite(){
    const updatedPost = postData.map(post => {
      if (post.id !== id) return post;
      const newFavorite = !post.favorite;
      managePost({ ...post, favorite: newFavorite }, 'interact')
        .then(() => console.log(`Post ${newFavorite ? 'favorite.' : 'favorite removed.'}.`))
        .catch(err => console.log('Failed to interact with post.', err));

      return { ...post, favorite: newFavorite };
    });
    setPostData(updatedPost)
  }

  return (
  <div className="post-interactions">
    <i aria-label="Like post" onClick={postToLike} className='bi bi-heart'>
      {like 
      ? <i aria-label="Liked post" 
      className="bi bi-heart-fill in"></i>
      : ''}
    </i>
    <i aria-label="Comment post" className="bi bi-chat"></i>
    <i aria-label="Favorite post" onClick={postToFavorite} className="bi bi-star">
      {favorite 
      ? <i aria-label="Favorite post" 
            className="bi bi-star-fill in"></i>
      : ''}
    </i>
  </div>
  )
}

function PostControl({ controlRef, id }){
  const { setPostData } = useContext(PostContext);

  function delPost(){
    if(!window.confirm("This action can't be undone. Proceed?")) return;
    managePost(id, 'delete')
      .then(() => {
        setPostData(prev => prev.filter(post => post.id !== id));
      }).catch((err) => {
        console.log('Failed to delete post.', err);
      })
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
