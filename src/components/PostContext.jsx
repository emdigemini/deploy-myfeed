import { createContext, useState } from "react"

export const PostContext = createContext();
export function PostProvider({children}){
  const [postData, setPostData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("postData")) || [];
    savedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return savedData;
  });
  return (
    <PostContext.Provider value={{postData, setPostData}}>
      {children}
    </PostContext.Provider>
  )
}
