import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <>
      <nav className="p-4">
        <Link to="/">Home</Link>
      </nav>
      <Routes>
        {/* <Route path="/" element={<div />} /> */}
        {/* <Route path="/profile/:id" element={<ProfilePage />} /> */}
      </Routes>
    </>
  );
}
