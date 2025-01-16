import './App.scss';
import { HomePage, CollegesPage, ProfessorsPage, ErrorPage } from './pages'
import { AuthenticationWindow, NavBar } from './components';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import authFetch from './services/auth_fetch';


function App() {
  const [showAuthWindow, setShowAuthWindow] = useState(false); // authentication window
  const [userDetails, setUserDetails] = useState(null); // user details (id, name, email)

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
      <BrowserRouter>
        <NavBar userDetails={userDetails} setUserDetails={setUserDetails} setShowAuthWindow={setShowAuthWindow} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/professors" element={<ProfessorsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      {showAuthWindow && <AuthenticationWindow closeWindow={closeAuthWindow} />}
    </div>
  )
}

export default App