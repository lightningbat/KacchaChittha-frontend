import './App.scss';
import { HomePage, CollegesListPage, ProfessorsListPage, ErrorPage, ProfessorReviewPage, DepartmentsPage, CollegeProfessorsPage } from './pages'
import { AuthenticationWindow, NavBar, ProfessorForm } from './components';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [showAuthWindow, setShowAuthWindow] = useState(false);
  const [showProfessorForm, setShowProfessorForm] = useState(false);

  const closeAuthWindow = (get_user = false) => {
    setShowAuthWindow(false);
    if (get_user) { // if user is logged in successfully
      window.location.reload();
    }
  }
  
  return (
    <div className="body">
      <BrowserRouter className="body-container">
        <NavBar setShowAuthWindow={setShowAuthWindow} setShowProfessorForm={setShowProfessorForm} />
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