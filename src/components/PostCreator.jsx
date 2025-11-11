import { useState , useRef, useEffect, useContext } from "react";
import { PostContext } from "./PostContext";
import { MediaContext } from "./MediaContext";
import { getAllPosts, savePost } from "../utils/db";

export function PostCreator(){
  const [createPost, setCreatePost] = useState(false);

  function closeCreator(e){
    if(e.target.classList.contains('create-post-overlay')) setCreatePost(false);
  }

  return (
    <>
      {createPost && <CreatePost closeCreator={closeCreator} setCreatePost={setCreatePost} />}
      <div onClick={() => setCreatePost(true)} className="post-creator">
        <button className="app-icon">
          <img src="icons/my-feed.svg" alt="My Feed" />
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
    const postField = inputField.current.textContent;
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

  const upload = async () => {
    const timestamp = Date.now();
    const id = crypto.randomUUID();

    const newPost = 
      {id, postText, fontSize, mediaFiles: mediaFiles, timestamp};

    try {
      await savePost(newPost);

      const updatedPosts = await getAllPosts();
      setPostData(updatedPosts); 
      setFontSize(14);
      setPostText("");
      setMediaFiles([]);
      setCreatePost(false);
      console.log('Success.');
      console.log(postData);
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
      <button onClick={upload} className="submit-post">POST</button>
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