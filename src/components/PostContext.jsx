import { createContext, useEffect, useState } from "react"
import { getAllPosts } from "../utils/db";

export const PostContext = createContext();
export function PostProvider({children}){
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    async function fetchPosts(){
      const posts = await getAllPosts();
      setPostData(posts);
    }
    fetchPosts();
  }, [])

  return (
    <PostContext.Provider value={{postData, setPostData}}>
      {children}
    </PostContext.Provider>
  )
}
