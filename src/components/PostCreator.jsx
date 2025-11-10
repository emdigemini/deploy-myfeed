import { useState , useRef, useEffect, useContext } from "react";
import { PostContext } from "./PostContext";
import { MediaContext } from "./MediaContext";

export function PostCreator(){
  const [createPost, setCreatePost] = useState(false);
  const {mediaFiles, setMediaFiles} = useContext(MediaContext);

  function postEditor(){
    setCreatePost(true);
  }

  function postCreator(e){
    if(mediaFiles.length > 0) return;
    if(e.target.classList.contains('create-post-overlay')) setCreatePost(false);
  }

  return (
    <>
      {createPost && <CreatePost postCreator={postCreator} setCreatePost={setCreatePost} />}
      <div onClick={postEditor} className="post-creator">
        <div className="app-icon">
          <img src="../../public/icons/my-feed.svg" alt="My Feed" />
        </div>
      </div>
    </>
  );
}

function CreatePost({postCreator, setCreatePost}){
  const {mediaFiles, setMediaFiles} = useContext(MediaContext);
  const [postText, setPostText] = useState("");
  const inputField = useRef(null);

  useEffect(() => {
    inputField.current.focus();
  }, []);

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }

  const writePost = () => {
    const postField = inputField.current.textContent;
    setPostText(postField);
    if(inputField && postField.length > 0){
      inputField.current.classList.remove('empty');
    } else {
      inputField.current.classList.add('empty');
    }
  }

  return (
    <div onClick={postCreator} className="create-post-overlay">
      <div className="create-post">
        <div className="create-post_header">
          <p>Anything goes</p>
        </div>
        <div ref={inputField} onInput={writePost} contentEditable className="create-post_box empty">

        </div>
        <div className="prev-media">
          {mediaFiles.map((file, i) => {
            const url = URL.createObjectURL(file);
            return(
              <div className="media" key={`${file.name}-${i}`}>
                <i onClick={() => removeFile(i)} className="bi bi-x"></i>
                <img className="file" src={url} alt={file.name} />
              </div>
            )
          })}
        </div>
        <PostActions postText={postText} setCreatePost={setCreatePost} />
      </div>
    </div>
  )
}

function PostActions({postText, setCreatePost}){
  const {mediaFiles, setMediaFiles} = useContext(MediaContext);
  const {postData, setPostData} = useContext(PostContext);
  const fileInput = useRef(null);

  const [fontSize, setFontSize] = useState(14);
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
      document.documentElement.style.setProperty('--adjust_FontSize', `${size}px`);
    }
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
    e.target.value = "";
  }

  const upload = () => {
    if(postText.replace(/\s/g, '').length === 0) return;
    
    const timestamp = new Date();

    if(postData.length > 0){
      const sortedData = [...postData, {
        postText,
        fontSize,
        mediaFiles: [...mediaFiles],
        timestamp
      }].sort((a, b) => b.timestamp - a.timestamp);
      setPostData(sortedData);
      localStorage.setItem("postData", JSON.stringify(sortedData));
    } else {
      console.log('1st data');
      setPostData(prev => {
      const newData = [...prev,
        {
          postText,
          fontSize,
          mediaFiles: [...mediaFiles],
          timestamp
      }];
      localStorage.setItem("postData", JSON.stringify(newData));
      return newData;
      });
    }
    
    setFontSize(14);
    setCreatePost(false);
  }

  return (
    <div className="post-actions">
      <div className="post-extras">
        <div className="add-media">
          <i onClick={() => fileInput.current.click()} className="bi bi-image"></i>
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
        <div className="adjust-font-size">
          <label htmlFor="adjFontSize">
            Adjust font size
          </label>
          <div className="input-wrapper">
            <button onClick={adjustFontSize}><i className="bi bi-fonts"></i></button>
            <input ref={fontSizeField} onInput={inputSize} onKeyDown={enterSize} id="adjFontSize" type="number" placeholder={`${fontSize}px`} />
          </div>
        </div>
      </div>

      <button onClick={upload} className="submit-post">POST</button>
    </div>
  )
}