import { Header } from "../components/Header";
import { MyFeed } from "../components/Myfeed";
import { PostCreator } from "../components/PostCreator";

export function HomePage(){
  return (
    <>
      <Header />
      <MyFeed />
      <PostCreator />
    </>
  );
}
