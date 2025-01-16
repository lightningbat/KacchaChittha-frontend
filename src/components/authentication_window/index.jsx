import './style.scss'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react';
import { Login, Signup, ForgotPass, Otp, ResetPass } from './pages';

AuthenticationWindow.propTypes = {
    closeWindow: PropTypes.func
}
export default function AuthenticationWindow({ closeWindow }) {
    const [currentPage, setCurrentPage] = useState("login");
    const redirected_from = useRef(null);
    const [userInput, setUserInput] = useState({ name: null, email: null, password: null });

    // disable page scrolling when authentication window is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        }
    }, [])

    /**
     * 
     * @param {string} page name of the page to be opened
     * @param {boolean} reset_user_input(default: false) weather to reset the user input on page change
     */
    const changePage = (page, reset_user_input = false) => {
        if (page === "otp") {
            redirected_from.current = currentPage;
        }
        if (reset_user_input) {
            setUserInput({ name: null, email: null, password: null });
        }
        setCurrentPage(page);
    }
    
    return (
        <div className="authentication-window" onClick={()=> closeWindow(false)}>
            <div className="content-container" onClick={(e) => e.stopPropagation()}>
                {currentPage === "login" && <Login changePage={changePage} defaultValue={userInput} setUserInput={setUserInput} closeWindow={closeWindow} />}
                {currentPage === "signup" && <Signup changePage={changePage} defaultValue={userInput} setUserInput={setUserInput} />}
                {currentPage === "forgot_pass" && <ForgotPass changePage={changePage} defaultValue={userInput} setUserInput={setUserInput} />}
                {currentPage === "otp" && <Otp changePage={changePage} redirected_from={redirected_from.current} user_email={userInput.email} closeWindow={closeWindow} />}
                {currentPage === "reset_pass" && <ResetPass changePage={changePage} />}
            </div>
        </div>
    )
}