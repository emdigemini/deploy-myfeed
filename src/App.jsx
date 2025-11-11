import 'bootstrap-icons/font/bootstrap-icons.css';
import "@fontsource/montserrat"
import './Main.scss'
import { Routes, Route } from 'react-router-dom'
import { Startup } from './components/Startup'
import { HomePage } from './Pages/HomePage';
import { MediaProvider } from './components/MediaContext';
import { PostProvider } from './components/PostContext';

function App() {
  return (
    <>
      <MediaProvider>
        <PostProvider>
          <Routes>
            <Route path='/' element={<Startup />} />
            <Route path="/myfeed" element={<HomePage />} />
          </Routes>
        </PostProvider>
      </MediaProvider>
    </>
  )
}

export default App
