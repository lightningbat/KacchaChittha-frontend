import './App.scss';
import { HomePage, CollegesListPage, ProfessorsListPage, ErrorPage, ProfessorReviewPage, DepartmentsPage, CollegeProfessorsPage } from './pages'
import { AuthenticationWindow, NavBar, ProfessorForm } from './components';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import authFetch from './services/auth_fetch';
import { user_details_cache } from './utils/cache';

function App() {
  const [userDetails, setUserDetails] = useState(null); // user details (id, name, email)
  const [showAuthWindow, setShowAuthWindow] = useState(false); // authentication window
  const [showProfessorForm, setShowProfessorForm] = useState(false);

  // startup functions
  useEffect(() => {
    if (!userDetails) {
      getUserDetails();
    }
  }, []);

  async function getUserDetails() {
    const response = await authFetch({ route: "get-user", method: "GET" });
    if (response.code === 200) {
      setUserDetails(response.data);
      
      // Storing user details in cache
      // 1st clearing the cache
      user_details_cache.clear();
      // 2nd adding the new user details
      Object.entries(response.data).forEach(([key, value]) => user_details_cache.set(key, value));
    }
  }

  const closeAuthWindow = (get_user = false) => {
    setShowAuthWindow(false);
    if (get_user) { // if user is logged in
      getUserDetails();
    }
  }
  
  return (
    <div className="body">
      <BrowserRouter className="body-container">
        <NavBar userDetails={userDetails} setUserDetails={setUserDetails} setShowAuthWindow={setShowAuthWindow} setShowProfessorForm={setShowProfessorForm} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colleges" element={<CollegesListPage />} />
          <Route path="/professors" element={<ProfessorsListPage />} />
          <Route path="/professor/:id" element={<ProfessorReviewPage showAuthenticationWindow={() => setShowAuthWindow(true)} />} />
          <Route path="/college/:id/departments" element={<DepartmentsPage />} />
          <Route path="/college/:id/:department/professors" element={<CollegeProfessorsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      {showAuthWindow && <AuthenticationWindow closeWindow={closeAuthWindow} />}
      {showProfessorForm && <ProfessorForm closeForm={()=> setShowProfessorForm(false)} />}
    </div>
  )
}

export default App