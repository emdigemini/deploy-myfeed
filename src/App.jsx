import 'bootstrap-icons/font/bootstrap-icons.css';
import "@fontsource/montserrat"
import './Main.scss'
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Startup } from './components/Startup'
import { HomePage } from './Pages/Homepage';
import { MediaProvider } from './components/MediaContext';
import { PostProvider } from './components/PostContext';

function App() {
  return (
    <>
      <MediaProvider>
        <PostProvider>
          <Routes>
            <Route element={<Startup />} />
            <Route index element={<HomePage />} />
          </Routes>
        </PostProvider>
      </MediaProvider>
    </>
  )
}

export default App
