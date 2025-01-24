import './style.scss'
import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import authFetch from '../../services/auth_fetch';
import useCustomDialog from '../../custom/dialogs'
import OutsideClickDetector from '../outside_click_detector';
import PropTypes from 'prop-types'
import { user_details_cache } from '../../utils/cache';

import kaccha_chittha_icon from '../../assets/media/kaccha_chittha_icon.png'

NavBar.propTypes = {
    userDetails: PropTypes.object,
    setUserDetails: PropTypes.func,
    setShowAuthWindow: PropTypes.func,
    setShowProfessorForm: PropTypes.func
}
export default function NavBar({ userDetails, setUserDetails, setShowAuthWindow, setShowProfessorForm }) {
    const customDialogs = useCustomDialog()
    const [showMenu, setShowMenu] = useState(false); // user menu
    const menuBtnRef = useRef(null);

    async function logout() {
        const confirm = await customDialogs({
            type: 'confirm',
            title: 'Logout',
            description: 'Are you sure you want to logout?',
        })
        if (!confirm) return;

        const response = await authFetch({ route: "logout", method: "DELETE" });
        if (response.code === 200) {
            setUserDetails(null);
            user_details_cache.clear();
        }
    }

    const handle_AddProfessorClick = () => {
        setShowProfessorForm(true);
        setShowMenu(false);
    }

    const handle_LogoutClick = () => {
        logout();
        setShowMenu(false);
    }

    return (
        <nav className='no-select'>
            <div className='nav-pc-view'>
                <div className="logo">
                    <Link to="/">
                        <img src={kaccha_chittha_icon} alt="Kaccha Chittha" />
                    </Link>
                </div>
                <div className={`links-container ${userDetails ? "logged-in" : ""}`}>
                    <ul className='links'>
                        <li>
                            <Link to="/colleges">
                                <svg width="34" height="25" viewBox="0 0 34 25" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.99 0L0 8.17667L6.17818 11.1475V19.3242L16.99 24.53L27.8018 19.3242V11.1475L30.8909 9.6621V19.0789H33.98V8.17667L16.99 0ZM27.5238 8.17667L16.99 13.2462L6.4562 8.17667L16.99 3.10713L27.5238 8.17667ZM24.7127 17.7161L16.99 21.4229L9.26727 17.7161V12.633L16.99 16.3533L24.7127 12.633V17.7161Z" fill="currentColor" />
                                </svg>
                                Colleges
                            </Link>
                        </li>
                        <li>
                            <Link to="/professors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                </svg>
                                Professors
                            </Link>
                        </li>
                    </ul>
                    <div className='user'>
                        {!userDetails ? <p className='login' onClick={() => setShowAuthWindow(true)}>Login</p> :
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setShowMenu(!showMenu)} ref={menuBtnRef} width="16" height="16" fill="currentColor" className="user-icon" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>}
                        {showMenu && userDetails &&
                            <OutsideClickDetector closePopup={() => setShowMenu(false)} buttonRef={menuBtnRef} style={{ position: "absolute", top: "40px", right: "0px" }}>
                                <div className="user-menu">
                                    <div className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="menu-item-icon" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                        </svg>
                                        <p className="menu-item-text">{userDetails.name}</p>
                                    </div>
                                    <div className="menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="menu-item-icon email-icon" viewBox="0 0 16 16">
                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
                                        </svg>
                                        <p className="menu-item-text">{userDetails.email}</p>
                                    </div>
                                    <div className="menu-item add-professor" onClick={handle_AddProfessorClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="menu-item-icon" viewBox="0 0 16 16">
                                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                            <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                        <p className="menu-item-text">Add Professor</p>
                                    </div>
                                    <div className="menu-item logout" onClick={handle_LogoutClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="menu-item-icon" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                        </svg>
                                        <p className="menu-item-text">Logout</p>
                                    </div>

                                </div>
                            </OutsideClickDetector>
                        }
                    </div>
                </div>
            </div>
            <div className="nav-mobile-view">
                <ul className='links'>
                    <li>
                        <Link to="/colleges">
                            <svg width="34" height="25" viewBox="0 0 34 25" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.99 0L0 8.17667L6.17818 11.1475V19.3242L16.99 24.53L27.8018 19.3242V11.1475L30.8909 9.6621V19.0789H33.98V8.17667L16.99 0ZM27.5238 8.17667L16.99 13.2462L6.4562 8.17667L16.99 3.10713L27.5238 8.17667ZM24.7127 17.7161L16.99 21.4229L9.26727 17.7161V12.633L16.99 16.3533L24.7127 12.633V17.7161Z" fill="currentColor" />
                            </svg>
                            Colleges
                        </Link>
                    </li>
                    <li>
                        <Link to="/professors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                            </svg>
                            Professors
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}