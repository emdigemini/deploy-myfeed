import { useState , useRef, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { PostContext } from "./PostContext";
import { MediaContext } from "./MediaContext";
import { getAllPosts, managePost } from "../utils/db";

export function PostCreator() {
  const location = useLocation(); 
  const [createPost, setCreatePost] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [pos, setPos] = useState({ x: 85, y: 90 });
  const [startDrag, setStartDrag] = useState({
    startX: 0,
    startY: 0,
    x: 85,
    y: 90
  });

  const postCreatorIcon = useRef(null);

  useEffect(() => {
    if(postCreatorIcon.current && location.pathname !== '/home/myfeed'){
      postCreatorIcon.current.style.display = 'none';
    } else {
      postCreatorIcon.current.style.display = 'flex';
    }
  }, [location])

  const closeCreator = (e) => {
    if (e.target.classList.contains("create-post-overlay")) setCreatePost(false);
  };

  const getClientCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    } else {
      return { clientX: e.clientX, clientY: e.clientY };
    }
  };

  const handleDragStart = (e) => {
    const { clientX, clientY } = getClientCoords(e);
    setIsHolding(true);
    setStartDrag({
      startX: clientX,
      startY: clientY,
      x: pos.x,
      y: pos.y
    });
  };

  const handleDragMove = (e) => {
    if (!isHolding) return;
    const { clientX, clientY } = getClientCoords(e);

    const dx = clientX - startDrag.startX;
    const dy = clientY - startDrag.startY;

    const newX = Math.min(100, Math.max(0, startDrag.x + (dx / window.innerWidth) * 100));
    const newY = Math.min(100, Math.max(0, startDrag.y + (dy / window.innerHeight) * 100));

    setPos({ x: newX, y: newY });
  };

  const handleDragEnd = () => setIsHolding(false);

  return (
    <>
      {createPost && <CreatePost closeCreator={closeCreator} setCreatePost={setCreatePost} />}
      <div
        ref={postCreatorIcon}
        className="post-creator"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={() => setCreatePost(true)}
          style={{
            transform: `translate(${pos.x}vw, ${pos.y}vh)`,
            transition: isHolding ? "none" : "transform 0.05s linear"
          }}
      >
        <button
          className="app-icon"
          
        >
          <img draggable={false} src="icons/my-feed.svg" alt="My Feed" />
        </button>
      </div>
    </>
  );
}


function CreatePost({ closeCreator, setCreatePost }){
  const {mediaFiles, setMediaFiles} = useContext(MediaContext);
  const [urls, setUrls] = useState([]);
  const [postText, setPostText] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const inputField = useRef(null);

  useEffect(() => {
    const newUrls = mediaFiles.map(file => URL.createObjectURL(file));
    setUrls(newUrls);

    return () => newUrls.forEach(url => URL.revokeObjectURL(url));
  }, [mediaFiles]);

  useEffect(() => {
    inputField.current.focus();
  }, []);

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }

  const writePost = () => {
    const postField = inputField.current.innerHTML
      .replaceAll('<div>', '<br>')
      .replaceAll('</div>', '');
    setPostText(postField);
    if(postField.length > 0){
      inputField.current.classList.remove('empty');
    } else {
      inputField.current.classList.add('empty');
    }
  }

  return (
    <div onClick={(e) => closeCreator(e)} className="create-post-overlay">
      <div className="create-post">
        <div className="create-post_header">
          <p>Anything goes</p>
        </div>
        <div ref={inputField} onInput={writePost} 
        style={{fontSize: `${fontSize}px`}} aria-multiline="true"
        role="text-box" 
        contentEditable className="create-post_box empty">
          
        </div>
        <div className="prev-media">
          {urls.map((url, i) => {
            return(
              <div className="media" key={`${url}-${i}`}>
                <i onClick={() => removeFile(i)} className="bi bi-x"></i>
                <img className="file" src={url} />
              </div>
            )
          })}
        </div>
        <PostActions postText={postText} setPostText={setPostText}
          setCreatePost={setCreatePost}
          fontSize={fontSize} setFontSize={setFontSize} />
      </div>
    </div>
  )
}

function PostActions({ postText, setPostText, setCreatePost, fontSize, setFontSize }){
  const {mediaFiles, setMediaFiles} = useContext(MediaContext);
  const {postData, setPostData} = useContext(PostContext);
  const postRef = useRef(null);

  useEffect(() => {
    if(postText.trim().length === 0 && mediaFiles.length === 0){
      postRef.current.classList.add('unavailable');
    } else {
      postRef.current.classList.remove('unavailable');
    }
  }, [postText, mediaFiles]);

  const upload = async () => {
    if(postText.trim().length === 0 && mediaFiles.length === 0) {
      postRef.current.classList.add('unavailable');
      return;
    }
    const timestamp = Date.now();
    function generateUUID() {
      if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
      } else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }
    const id = generateUUID();

    const newPost = 
      {id, postText, fontSize, mediaFiles: mediaFiles, timestamp, like: false, comment: [], favorite: false};

    try {
      await managePost(newPost, 'save');

      const updatedPosts = await getAllPosts();
      setPostData(updatedPosts); 
      setFontSize(14);
      setPostText("");
      setMediaFiles([]);
      setCreatePost(false);
    } catch(error){
      console.error("Error saving post to IndexedDB:", error);
      alert("Sorry, failed to save post.");
    }
  }

  return (
    <div className="post-actions">
      <div className="post-extras">
        <AddMedia setMediaFiles={setMediaFiles} />
        <AdjustFontsize fontSize={fontSize} setFontSize={setFontSize} />
      </div>
      <button ref={postRef} onClick={upload} className="submit-post">POST</button>
    </div>
  )
}

function AddMedia({ setMediaFiles }){
  const fileInput = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
    e.target.value = "";
  }

  return (
    <div className="add-media">
      <button aria-label="Add photo" onClick={() => fileInput.current.click()} >
        <i className="bi bi-image"></i>
      </button>
      <input
        ref={fileInput}
        onChange={handleFiles}
        type="file"
        id="fileInput"
        accept="image"
        multiple
      />
      <div className="media-label">
        <p>Add a photo <br /> or a video</p>
      </div>
    </div>
  );
}

function AdjustFontsize({ fontSize, setFontSize }){
  const fontSizeField = useRef(null);

  const inputSize = (e) => {
    if(e.target.value > 64) e.target.value = 64;
  }

  const enterSize = (e) => {
    if(e.key === 'Enter' && e.target.value !== ''){
      adjustFontSize();
    }
  }

  const adjustFontSize = () => {
    const size = fontSizeField.current.value;
    if(size > 7){
      setFontSize(size);
    }
  }

  return (
    <div className="adjust-font-size">
      <label htmlFor="adjFontSize">
        Adjust font size
      </label>
      <div className="input-wrapper">
        <button onClick={adjustFontSize}><i className="bi bi-fonts"></i></button>
        <input ref={fontSizeField} onInput={inputSize} onKeyDown={enterSize} id="adjFontSize" type="number" placeholder={`${fontSize}px`} />
      </div>
    </div>
  )
}
