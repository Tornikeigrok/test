import React from 'react';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import { Routes, Route } from 'react-router';
import { UserProvider } from './Components/InfoContext';
import { DocumentContentProvider } from './Components/DocumentContent';
import DocumentPage from './Components/DocumentPage';
function App() {
  return (
    <UserProvider>
    <DocumentContentProvider>
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/HomePage" element={<HomePage />}/>
      <Route path="/DocumentPage" element={<DocumentPage />}/>
    </Routes>
    </DocumentContentProvider>
    </UserProvider>
  );
}

export default App;

