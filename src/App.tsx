import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Landing } from './components/Landing';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </MainLayout>
      </LanguageProvider>
    </Router>
  );
}

export default App;