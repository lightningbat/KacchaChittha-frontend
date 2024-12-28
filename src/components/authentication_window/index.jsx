import './style.scss'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react';
import { Login, Signup, ForgotPass, Otp, ResetPass } from './pages';

AuthenticationWindow.propTypes = {
    closeWindow: PropTypes.func
}
export default function AuthenticationWindow({ closeWindow }) {
    const [currentPage, setCurrentPage] = useState("reset_pass");
    const redirected_from = useRef(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        }
    }, [])

    const changePage = (page) => {
        if (page === "otp") {
            redirected_from.current = currentPage;
        }
        setCurrentPage(page);
    }
    
    return (
        <div className="authentication-window" onClick={closeWindow}>
            <div className="content-container" onClick={(e) => e.stopPropagation()}>
                {currentPage === "login" && <Login changePage={changePage} />}
                {currentPage === "signup" && <Signup changePage={changePage} />}
                {currentPage === "forgot_pass" && <ForgotPass changePage={changePage} />}
                {currentPage === "otp" && <Otp changePage={changePage} redirected_from={redirected_from.current} />}
                {currentPage === "reset_pass" && <ResetPass changePage={changePage} />}
            </div>
        </div>
    )
}