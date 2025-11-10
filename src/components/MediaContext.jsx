import { createContext, useState } from "react";

export const MediaContext = createContext();
export function MediaProvider({ children }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  return (
    <MediaContext.Provider value={{mediaFiles, setMediaFiles}}>
      {children}
    </MediaContext.Provider>
  )
}