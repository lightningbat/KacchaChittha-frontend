import './App.scss';
import { HomePage, CollegesPage, ProfessorsPage, ErrorPage } from './pages'
import { AuthenticationWindow } from './components';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function App() {
  const [showAuthWindow, setShowAuthWindow] = useState(false);

  return (
    <div className="body">
      <BrowserRouter>
      <nav className='no-select'>
        <div className='nav-pc-view'>
          <div className="logo">
            <Link to="/">
              <svg width="66" height="61" viewBox="0 0 66 61" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.234497" width="9.6976" height="60.5264" />
                <path d="M11.6522 35.6312L18.5094 28.7739L43.6131 53.8777L36.968 61L11.6522 35.6312Z" />
                <path opacity="0.9" d="M32.968 0H43.968L9.38726 34.2743L8.61224 23.6994L32.968 0Z" />
                <path d="M65.3856 0L57.1928 8.0256L38.968 8.0256L47.1608 0L65.3856 0Z" />
                <path d="M36.968 53V61H64.968L56.2844 53H36.968Z" />
              </svg>
            </Link>
          </div>
          <div className="links-container">
            <ul className='links'>
              <li>
                  <Link to="/colleges">
                    <svg width="50" height="34" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="path-1-inside-1_9_43" fill="white">
                        <path d="M17.8003 3.62598C17.8003 1.6234 19.4237 0 21.4263 0H28.7991C30.8017 0 32.4251 1.62341 32.4251 3.62598V29.3704H17.8003V3.62598Z" />
                      </mask>
                      <path d="M16.5917 3.62598C16.5917 0.955882 18.7562 -1.20866 21.4263 -1.20866H28.7991C31.4692 -1.20866 33.6338 0.955882 33.6338 3.62598L31.2164 3.62598C31.2164 2.29093 30.1342 1.20866 28.7991 1.20866H21.4263C20.0913 1.20866 19.009 2.29093 19.009 3.62598L16.5917 3.62598ZM32.4251 29.3704H17.8003H32.4251ZM16.5917 29.3704V3.62598C16.5917 0.955882 18.7562 -1.20866 21.4263 -1.20866L21.4263 1.20866C20.0913 1.20866 19.009 2.29093 19.009 3.62598V29.3704H16.5917ZM28.7991 -1.20866C31.4692 -1.20866 33.6338 0.955882 33.6338 3.62598V29.3704H31.2164V3.62598C31.2164 2.29093 30.1342 1.20866 28.7991 1.20866V-1.20866Z" fill="#currentColor" mask="url(#path-1-inside-1_9_43)" />
                      <mask id="path-3-inside-2_9_43" fill="white">
                        <path d="M21.5472 21.2724C21.5472 20.2711 22.3589 19.4594 23.3602 19.4594H26.8653C27.8666 19.4594 28.6783 20.2711 28.6783 21.2724V29.3704H21.5472V21.2724Z" />
                      </mask>
                      <path d="M20.7011 21.2724C20.7011 19.8038 21.8916 18.6134 23.3602 18.6134H26.8653C28.3338 18.6134 29.5243 19.8038 29.5243 21.2724L27.8322 21.2724C27.8322 20.7384 27.3993 20.3055 26.8653 20.3055H23.3602C22.8261 20.3055 22.3932 20.7384 22.3932 21.2724L20.7011 21.2724ZM28.6783 29.3704H21.5472H28.6783ZM20.7011 29.3704V21.2724C20.7011 19.8038 21.8916 18.6134 23.3602 18.6134L23.3602 20.3055C22.8261 20.3055 22.3932 20.7384 22.3932 21.2724V29.3704H20.7011ZM26.8653 18.6134C28.3338 18.6134 29.5243 19.8038 29.5243 21.2724V29.3704H27.8322V21.2724C27.8322 20.7384 27.3993 20.3055 26.8653 20.3055L26.8653 18.6134Z" fill="#currentColor" mask="url(#path-3-inside-2_9_43)" />
                      <mask id="path-5-inside-3_9_43" fill="white">
                        <path d="M31.3373 12.6909H42.3361C44.3387 12.6909 45.9621 14.3143 45.9621 16.3168V29.3704H31.3373V12.6909Z" />
                      </mask>
                      <path d="M31.3373 11.4822H42.3361C45.0062 11.4822 47.1708 13.6467 47.1708 16.3168L44.7534 16.3168C44.7534 14.9818 43.6712 13.8995 42.3361 13.8995H31.3373V11.4822ZM45.9621 29.3704H31.3373H45.9621ZM31.3373 29.3704V12.6909V29.3704ZM42.3361 11.4822C45.0062 11.4822 47.1708 13.6467 47.1708 16.3168V29.3704H44.7534V16.3168C44.7534 14.9818 43.6712 13.8995 42.3361 13.8995V11.4822Z" fill="#currentColor" mask="url(#path-5-inside-3_9_43)" />
                      <mask id="path-7-inside-4_9_43" fill="white">
                        <path d="M19.009 12.6909H8.01019C6.00761 12.6909 4.38421 14.3143 4.38421 16.3168V29.3704H19.009V12.6909Z" />
                      </mask>
                      <path d="M19.009 11.4822H8.01019C5.34009 11.4822 3.17555 13.6467 3.17555 16.3168L5.59287 16.3168C5.59287 14.9818 6.67514 13.8995 8.01019 13.8995H19.009V11.4822ZM4.38421 29.3704H19.009H4.38421ZM19.009 29.3704V12.6909V29.3704ZM8.01019 11.4822C5.34009 11.4822 3.17555 13.6467 3.17555 16.3168V29.3704H5.59287V16.3168C5.59287 14.9818 6.67514 13.8995 8.01019 13.8995V11.4822Z" fill="#currentColor" mask="url(#path-7-inside-4_9_43)" />
                      <line x1="21.5472" y1="4.9555" x2="28.6783" y2="4.9555" stroke="#currentColor" strokeWidth="0.966927" />
                      <line x1="21.5472" y1="10.0319" x2="28.6783" y2="10.0319" stroke="#currentColor" strokeWidth="0.966927" />
                      <line x1="21.5472" y1="15.1083" x2="28.6783" y2="15.1083" stroke="#currentColor" strokeWidth="0.966927" />
                      <line x1="7.88934" y1="17.7069" x2="15.5039" y2="17.7069" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                      <line x1="34.9633" y1="17.7069" x2="42.5779" y2="17.7069" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                      <line x1="7.88934" y1="21.4536" x2="15.5039" y2="21.4536" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                      <line x1="34.9633" y1="21.4536" x2="42.5779" y2="21.4536" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                      <line x1="7.88934" y1="25.2005" x2="15.5039" y2="25.2005" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                      <line x1="34.9633" y1="25.2005" x2="42.5779" y2="25.2005" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                      <path d="M0.999977 29.9143L49.2255 29.9143" stroke="#currentColor" strokeWidth="1.08779" strokeLinecap="round" />
                      <path d="M2.57123 32.9459H47.5333" stroke="#currentColor" strokeWidth="1.08779" strokeLinecap="round" />
                    </svg>
                    Colleges
                  </Link>
              </li>
              <li>
                <Link to="/professors">
                  <svg width="19" height="30" viewBox="0 0 19 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5564 6.29615C14.3095 7.88526 13.4489 9.31618 12.3881 10.3517C11.3164 11.3978 10.0908 11.9935 9.15206 11.9935C8.3394 11.9935 7.08347 11.4257 5.96256 10.3902C4.85326 9.36554 3.93732 7.93706 3.74809 6.30006C3.37604 3.08138 6.12266 0.838524 9.15206 0.838524C12.165 0.838524 14.8607 3.2363 14.5564 6.29615Z" stroke="#currentColor" strokeWidth="0.673142" />
                    <circle cx="7.41601" cy="5.50249" r="0.865469" stroke="#currentColor" strokeWidth="0.480816" />
                    <circle cx="10.7817" cy="5.50249" r="0.865469" stroke="#currentColor" strokeWidth="0.480816" />
                    <line x1="8.28149" y1="5.1659" x2="9.91627" y2="5.1659" stroke="#currentColor" strokeWidth="0.480816" />
                    <line x1="11.6704" y1="5.45547" x2="14.6514" y2="5.74396" stroke="#currentColor" strokeWidth="0.480816" />
                    <line y1="-0.240408" x2="2.99499" y2="-0.240408" transform="matrix(0.981443 -0.191753 -0.191753 -0.981443 3.56949 5.88452)" stroke="#currentColor" strokeWidth="0.480816" />
                    <path d="M2.21762 6.79222L2.21237 6.76598L2.20239 6.74115C2.15191 6.61564 2.09747 6.49703 2.04738 6.38787C2.04328 6.37894 2.03921 6.37007 2.03517 6.36126C1.98068 6.2424 1.93216 6.13503 1.89172 6.02766C1.8127 5.81787 1.76856 5.61812 1.78936 5.38378C1.81005 5.15078 1.88296 4.98576 1.99127 4.8122C2.03823 4.73695 2.08953 4.66359 2.14841 4.5794C2.16144 4.56077 2.17484 4.54161 2.18865 4.52178C2.26285 4.4152 2.34435 4.29541 2.42477 4.15661C2.51723 3.99701 2.564 3.8462 2.55462 3.69245C2.54632 3.55626 2.49315 3.44624 2.46228 3.38235C2.46028 3.37821 2.45837 3.37426 2.45657 3.37051C2.42342 3.30132 2.4077 3.26394 2.40194 3.2159C2.39655 3.17086 2.39817 3.09457 2.44365 2.96406C2.5412 2.74724 2.86978 2.45306 3.54288 2.27259C3.97236 2.17472 4.41336 2.24528 4.79818 2.38325L4.13011 3.68819L4.11777 3.71229L4.11013 3.73826L3.86973 4.55565L3.86481 4.5724L3.86194 4.58962L3.71769 5.45509L3.71166 5.4913L3.71488 5.52787L3.85912 7.16264L3.86158 7.19054L3.86936 7.21744L4.26672 8.59144C3.91951 8.70374 3.5956 8.71982 3.2114 8.68206C2.94209 8.56039 2.79943 8.42823 2.70939 8.31247C2.66033 8.2494 2.62252 8.18554 2.58651 8.11828C2.57727 8.10103 2.56676 8.08072 2.55548 8.05892C2.52924 8.00822 2.49884 7.94947 2.47061 7.90242C2.42712 7.82993 2.38624 7.69539 2.34384 7.48339C2.32423 7.38533 2.30585 7.2798 2.28605 7.16613L2.28431 7.15614C2.26408 7.04003 2.24247 6.91645 2.21762 6.79222Z" stroke="#currentColor" strokeWidth="0.576979" />
                    <path d="M16.0851 6.78087L16.0903 6.75462L16.1003 6.7298C16.1508 6.60429 16.2052 6.48568 16.2553 6.37652C16.2594 6.36758 16.2635 6.35872 16.2675 6.34991C16.322 6.23105 16.3705 6.12368 16.411 6.01631C16.49 5.80652 16.5341 5.60677 16.5133 5.37243C16.4927 5.13943 16.4197 4.97441 16.3114 4.80085C16.2645 4.7256 16.2132 4.65224 16.1543 4.56805C16.1413 4.54942 16.1279 4.53026 16.1141 4.51043C16.0398 4.40385 15.9584 4.28406 15.8779 4.14525C15.7855 3.98566 15.7387 3.83485 15.7481 3.6811C15.7564 3.54491 15.8096 3.43488 15.8404 3.371C15.8424 3.36686 15.8443 3.36291 15.8461 3.35916C15.8793 3.28996 15.895 3.25258 15.9008 3.20455C15.9062 3.1595 15.9045 3.08322 15.8591 2.9527C15.7615 2.73589 15.4329 2.44171 14.7598 2.26124C14.3303 2.16337 13.8893 2.23393 13.5045 2.3719L14.1726 3.67684L14.1849 3.70093L14.1926 3.72691L14.433 4.5443L14.4379 4.56105L14.4408 4.57827L14.585 5.44374L14.591 5.47995L14.5878 5.51652L14.4436 7.15129L14.4411 7.17919L14.4333 7.20608L14.036 8.58009C14.3832 8.69239 14.7071 8.70847 15.0913 8.67071C15.3606 8.54904 15.5033 8.41688 15.5933 8.30112C15.6424 8.23804 15.6802 8.17419 15.7162 8.10693C15.7254 8.08967 15.7359 8.06936 15.7472 8.04757C15.7735 7.99686 15.8039 7.93811 15.8321 7.89106C15.8756 7.81857 15.9165 7.68403 15.9589 7.47204C15.9785 7.37398 15.9969 7.26845 16.0167 7.15477L16.0184 7.14479C16.0386 7.02867 16.0602 6.90509 16.0851 6.78087Z" stroke="#currentColor" strokeWidth="0.576979" />
                    <path d="M0.68461 20.6C0.68461 16.5637 3.95669 13.2916 7.99301 13.2916H10.2048C14.2411 13.2916 17.5132 16.5637 17.5132 20.6V27.1391C17.5132 27.9889 16.8243 28.6777 15.9746 28.6777H2.22322C1.37347 28.6777 0.68461 27.9889 0.68461 27.1391V20.6Z" stroke="#currentColor" strokeWidth="0.769306" />
                    <path d="M8.9739 28.6003L12.8332 20.9172L11.1514 18.7273L12.7366 18.6594L11.6074 13.665" stroke="#currentColor" strokeWidth="0.673142" />
                    <path d="M9.01673 28.6117L5.15738 20.9286L6.83923 18.7387L5.25398 18.6708L6.38322 13.6764" stroke="#currentColor" strokeWidth="0.673142" />
                    <path d="M9.05079 22.2219L9.05079 22.2219L10.3003 13.5081L7.80129 13.5081L9.05079 22.2219Z" stroke="#currentColor" strokeWidth="0.576979" />
                    <line x1="7.41601" y1="13.5801" x2="7.41601" y2="11.2722" stroke="#currentColor" strokeWidth="0.576979" />
                    <line x1="10.7337" y1="13.5814" x2="10.7337" y2="11.5596" stroke="#currentColor" strokeWidth="0.576979" />
                  </svg>
                  Professors
                </Link>
              </li>
            </ul>
            <div className='user'>
              <p className='login' onClick={() => setShowAuthWindow(true)}>Login</p>
            </div>
          </div>
        </div>
        <div className="nav-mobile-view">
          <ul className='links'>
            <li>
              <Link to="/colleges">
                <svg width="50" height="34" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="path-1-inside-1_9_43" fill="white">
                    <path d="M17.8003 3.62598C17.8003 1.6234 19.4237 0 21.4263 0H28.7991C30.8017 0 32.4251 1.62341 32.4251 3.62598V29.3704H17.8003V3.62598Z" />
                  </mask>
                  <path d="M16.5917 3.62598C16.5917 0.955882 18.7562 -1.20866 21.4263 -1.20866H28.7991C31.4692 -1.20866 33.6338 0.955882 33.6338 3.62598L31.2164 3.62598C31.2164 2.29093 30.1342 1.20866 28.7991 1.20866H21.4263C20.0913 1.20866 19.009 2.29093 19.009 3.62598L16.5917 3.62598ZM32.4251 29.3704H17.8003H32.4251ZM16.5917 29.3704V3.62598C16.5917 0.955882 18.7562 -1.20866 21.4263 -1.20866L21.4263 1.20866C20.0913 1.20866 19.009 2.29093 19.009 3.62598V29.3704H16.5917ZM28.7991 -1.20866C31.4692 -1.20866 33.6338 0.955882 33.6338 3.62598V29.3704H31.2164V3.62598C31.2164 2.29093 30.1342 1.20866 28.7991 1.20866V-1.20866Z" fill="#currentColor" mask="url(#path-1-inside-1_9_43)" />
                  <mask id="path-3-inside-2_9_43" fill="white">
                    <path d="M21.5472 21.2724C21.5472 20.2711 22.3589 19.4594 23.3602 19.4594H26.8653C27.8666 19.4594 28.6783 20.2711 28.6783 21.2724V29.3704H21.5472V21.2724Z" />
                  </mask>
                  <path d="M20.7011 21.2724C20.7011 19.8038 21.8916 18.6134 23.3602 18.6134H26.8653C28.3338 18.6134 29.5243 19.8038 29.5243 21.2724L27.8322 21.2724C27.8322 20.7384 27.3993 20.3055 26.8653 20.3055H23.3602C22.8261 20.3055 22.3932 20.7384 22.3932 21.2724L20.7011 21.2724ZM28.6783 29.3704H21.5472H28.6783ZM20.7011 29.3704V21.2724C20.7011 19.8038 21.8916 18.6134 23.3602 18.6134L23.3602 20.3055C22.8261 20.3055 22.3932 20.7384 22.3932 21.2724V29.3704H20.7011ZM26.8653 18.6134C28.3338 18.6134 29.5243 19.8038 29.5243 21.2724V29.3704H27.8322V21.2724C27.8322 20.7384 27.3993 20.3055 26.8653 20.3055L26.8653 18.6134Z" fill="#currentColor" mask="url(#path-3-inside-2_9_43)" />
                  <mask id="path-5-inside-3_9_43" fill="white">
                    <path d="M31.3373 12.6909H42.3361C44.3387 12.6909 45.9621 14.3143 45.9621 16.3168V29.3704H31.3373V12.6909Z" />
                  </mask>
                  <path d="M31.3373 11.4822H42.3361C45.0062 11.4822 47.1708 13.6467 47.1708 16.3168L44.7534 16.3168C44.7534 14.9818 43.6712 13.8995 42.3361 13.8995H31.3373V11.4822ZM45.9621 29.3704H31.3373H45.9621ZM31.3373 29.3704V12.6909V29.3704ZM42.3361 11.4822C45.0062 11.4822 47.1708 13.6467 47.1708 16.3168V29.3704H44.7534V16.3168C44.7534 14.9818 43.6712 13.8995 42.3361 13.8995V11.4822Z" fill="#currentColor" mask="url(#path-5-inside-3_9_43)" />
                  <mask id="path-7-inside-4_9_43" fill="white">
                    <path d="M19.009 12.6909H8.01019C6.00761 12.6909 4.38421 14.3143 4.38421 16.3168V29.3704H19.009V12.6909Z" />
                  </mask>
                  <path d="M19.009 11.4822H8.01019C5.34009 11.4822 3.17555 13.6467 3.17555 16.3168L5.59287 16.3168C5.59287 14.9818 6.67514 13.8995 8.01019 13.8995H19.009V11.4822ZM4.38421 29.3704H19.009H4.38421ZM19.009 29.3704V12.6909V29.3704ZM8.01019 11.4822C5.34009 11.4822 3.17555 13.6467 3.17555 16.3168V29.3704H5.59287V16.3168C5.59287 14.9818 6.67514 13.8995 8.01019 13.8995V11.4822Z" fill="#currentColor" mask="url(#path-7-inside-4_9_43)" />
                  <line x1="21.5472" y1="4.9555" x2="28.6783" y2="4.9555" stroke="#currentColor" strokeWidth="0.966927" />
                  <line x1="21.5472" y1="10.0319" x2="28.6783" y2="10.0319" stroke="#currentColor" strokeWidth="0.966927" />
                  <line x1="21.5472" y1="15.1083" x2="28.6783" y2="15.1083" stroke="#currentColor" strokeWidth="0.966927" />
                  <line x1="7.88934" y1="17.7069" x2="15.5039" y2="17.7069" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                  <line x1="34.9633" y1="17.7069" x2="42.5779" y2="17.7069" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                  <line x1="7.88934" y1="21.4536" x2="15.5039" y2="21.4536" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                  <line x1="34.9633" y1="21.4536" x2="42.5779" y2="21.4536" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                  <line x1="7.88934" y1="25.2005" x2="15.5039" y2="25.2005" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                  <line x1="34.9633" y1="25.2005" x2="42.5779" y2="25.2005" stroke="#currentColor" strokeWidth="0.846061" strokeDasharray="3.63 2.42" />
                  <path d="M0.999977 29.9143L49.2255 29.9143" stroke="#currentColor" strokeWidth="1.08779" strokeLinecap="round" />
                  <path d="M2.57123 32.9459H47.5333" stroke="#currentColor" strokeWidth="1.08779" strokeLinecap="round" />
                </svg>
                Colleges
              </Link>
            </li>
            <li>
              <Link to="/professors">
                <svg width="19" height="30" viewBox="0 0 19 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5564 6.29615C14.3095 7.88526 13.4489 9.31618 12.3881 10.3517C11.3164 11.3978 10.0908 11.9935 9.15206 11.9935C8.3394 11.9935 7.08347 11.4257 5.96256 10.3902C4.85326 9.36554 3.93732 7.93706 3.74809 6.30006C3.37604 3.08138 6.12266 0.838524 9.15206 0.838524C12.165 0.838524 14.8607 3.2363 14.5564 6.29615Z" stroke="#currentColor" strokeWidth="0.673142" />
                  <circle cx="7.41601" cy="5.50249" r="0.865469" stroke="#currentColor" strokeWidth="0.480816" />
                  <circle cx="10.7817" cy="5.50249" r="0.865469" stroke="#currentColor" strokeWidth="0.480816" />
                  <line x1="8.28149" y1="5.1659" x2="9.91627" y2="5.1659" stroke="#currentColor" strokeWidth="0.480816" />
                  <line x1="11.6704" y1="5.45547" x2="14.6514" y2="5.74396" stroke="#currentColor" strokeWidth="0.480816" />
                  <line y1="-0.240408" x2="2.99499" y2="-0.240408" transform="matrix(0.981443 -0.191753 -0.191753 -0.981443 3.56949 5.88452)" stroke="#currentColor" strokeWidth="0.480816" />
                  <path d="M2.21762 6.79222L2.21237 6.76598L2.20239 6.74115C2.15191 6.61564 2.09747 6.49703 2.04738 6.38787C2.04328 6.37894 2.03921 6.37007 2.03517 6.36126C1.98068 6.2424 1.93216 6.13503 1.89172 6.02766C1.8127 5.81787 1.76856 5.61812 1.78936 5.38378C1.81005 5.15078 1.88296 4.98576 1.99127 4.8122C2.03823 4.73695 2.08953 4.66359 2.14841 4.5794C2.16144 4.56077 2.17484 4.54161 2.18865 4.52178C2.26285 4.4152 2.34435 4.29541 2.42477 4.15661C2.51723 3.99701 2.564 3.8462 2.55462 3.69245C2.54632 3.55626 2.49315 3.44624 2.46228 3.38235C2.46028 3.37821 2.45837 3.37426 2.45657 3.37051C2.42342 3.30132 2.4077 3.26394 2.40194 3.2159C2.39655 3.17086 2.39817 3.09457 2.44365 2.96406C2.5412 2.74724 2.86978 2.45306 3.54288 2.27259C3.97236 2.17472 4.41336 2.24528 4.79818 2.38325L4.13011 3.68819L4.11777 3.71229L4.11013 3.73826L3.86973 4.55565L3.86481 4.5724L3.86194 4.58962L3.71769 5.45509L3.71166 5.4913L3.71488 5.52787L3.85912 7.16264L3.86158 7.19054L3.86936 7.21744L4.26672 8.59144C3.91951 8.70374 3.5956 8.71982 3.2114 8.68206C2.94209 8.56039 2.79943 8.42823 2.70939 8.31247C2.66033 8.2494 2.62252 8.18554 2.58651 8.11828C2.57727 8.10103 2.56676 8.08072 2.55548 8.05892C2.52924 8.00822 2.49884 7.94947 2.47061 7.90242C2.42712 7.82993 2.38624 7.69539 2.34384 7.48339C2.32423 7.38533 2.30585 7.2798 2.28605 7.16613L2.28431 7.15614C2.26408 7.04003 2.24247 6.91645 2.21762 6.79222Z" stroke="#currentColor" strokeWidth="0.576979" />
                  <path d="M16.0851 6.78087L16.0903 6.75462L16.1003 6.7298C16.1508 6.60429 16.2052 6.48568 16.2553 6.37652C16.2594 6.36758 16.2635 6.35872 16.2675 6.34991C16.322 6.23105 16.3705 6.12368 16.411 6.01631C16.49 5.80652 16.5341 5.60677 16.5133 5.37243C16.4927 5.13943 16.4197 4.97441 16.3114 4.80085C16.2645 4.7256 16.2132 4.65224 16.1543 4.56805C16.1413 4.54942 16.1279 4.53026 16.1141 4.51043C16.0398 4.40385 15.9584 4.28406 15.8779 4.14525C15.7855 3.98566 15.7387 3.83485 15.7481 3.6811C15.7564 3.54491 15.8096 3.43488 15.8404 3.371C15.8424 3.36686 15.8443 3.36291 15.8461 3.35916C15.8793 3.28996 15.895 3.25258 15.9008 3.20455C15.9062 3.1595 15.9045 3.08322 15.8591 2.9527C15.7615 2.73589 15.4329 2.44171 14.7598 2.26124C14.3303 2.16337 13.8893 2.23393 13.5045 2.3719L14.1726 3.67684L14.1849 3.70093L14.1926 3.72691L14.433 4.5443L14.4379 4.56105L14.4408 4.57827L14.585 5.44374L14.591 5.47995L14.5878 5.51652L14.4436 7.15129L14.4411 7.17919L14.4333 7.20608L14.036 8.58009C14.3832 8.69239 14.7071 8.70847 15.0913 8.67071C15.3606 8.54904 15.5033 8.41688 15.5933 8.30112C15.6424 8.23804 15.6802 8.17419 15.7162 8.10693C15.7254 8.08967 15.7359 8.06936 15.7472 8.04757C15.7735 7.99686 15.8039 7.93811 15.8321 7.89106C15.8756 7.81857 15.9165 7.68403 15.9589 7.47204C15.9785 7.37398 15.9969 7.26845 16.0167 7.15477L16.0184 7.14479C16.0386 7.02867 16.0602 6.90509 16.0851 6.78087Z" stroke="#currentColor" strokeWidth="0.576979" />
                  <path d="M0.68461 20.6C0.68461 16.5637 3.95669 13.2916 7.99301 13.2916H10.2048C14.2411 13.2916 17.5132 16.5637 17.5132 20.6V27.1391C17.5132 27.9889 16.8243 28.6777 15.9746 28.6777H2.22322C1.37347 28.6777 0.68461 27.9889 0.68461 27.1391V20.6Z" stroke="#currentColor" strokeWidth="0.769306" />
                  <path d="M8.9739 28.6003L12.8332 20.9172L11.1514 18.7273L12.7366 18.6594L11.6074 13.665" stroke="#currentColor" strokeWidth="0.673142" />
                  <path d="M9.01673 28.6117L5.15738 20.9286L6.83923 18.7387L5.25398 18.6708L6.38322 13.6764" stroke="#currentColor" strokeWidth="0.673142" />
                  <path d="M9.05079 22.2219L9.05079 22.2219L10.3003 13.5081L7.80129 13.5081L9.05079 22.2219Z" stroke="#currentColor" strokeWidth="0.576979" />
                  <line x1="7.41601" y1="13.5801" x2="7.41601" y2="11.2722" stroke="#currentColor" strokeWidth="0.576979" />
                  <line x1="10.7337" y1="13.5814" x2="10.7337" y2="11.5596" stroke="#currentColor" strokeWidth="0.576979" />
                </svg>
                Professors
              </Link>
            </li>
          </ul>
        </div>
      </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/professors" element={<ProfessorsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      {showAuthWindow && <AuthenticationWindow closeWindow={() => setShowAuthWindow(false)} />}
    </div>
  )
}

export default App