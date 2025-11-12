import { Header } from "../components/NavMenu";
import { MyFeed } from "../components/MyFeed";
import { MyProfile } from "./MyProfile";
import { PostCreator } from "../components/PostCreator";
import { Routes, Route } from "react-router-dom";

export function HomePage(){
  return (
    <>
        <Header />
        <Routes>
          <Route path="myfeed" element={<MyFeed />} />
          <Route path="profile" element={<MyProfile />} />
        </Routes>
        <PostCreator />
    </>
  );
}
