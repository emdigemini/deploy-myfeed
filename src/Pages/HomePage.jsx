import { Header } from "../components/NavMenu";
import { MyFeed } from "../components/MyFeed";
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
