import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import authFetch from '../../../../services/auth_fetch'

Signup.propTypes = {
    changePage: PropTypes.func,
    defaultValue: PropTypes.object,
    setUserInput: PropTypes.func
}
export default function Signup({ changePage, defaultValue, setUserInput }) {
    const [error, setError] = useState({ type: null, message: null });
    const [loading, setLoading] = useState(false);
    const name_input_ref = useRef(null);
    const email_input_ref = useRef(null);
    const password_input_ref = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const validateForm = () => {
        const name = name_input_ref.current.value;
        const email = email_input_ref.current.value;
        const password = password_input_ref.current.value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // This regex matches a basic email format

        if (emailRegex.test(email) && password.length > 0 && name.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }

    // input event listeners
    useEffect(() => {
        const name_input = name_input_ref.current;
        const email_input = email_input_ref.current;
        const password_input = password_input_ref.current;

        name_input.addEventListener("input", validateForm);
        email_input.addEventListener("input", validateForm);
        password_input.addEventListener("input", validateForm);

        // validating form on load, incase if it's already filled (when user edits the page)
        validateForm();

        return () => {
            name_input.removeEventListener("input", validateForm);
            email_input.removeEventListener("input", validateForm);
            password_input.removeEventListener("input", validateForm);
        };
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        if (!isFormValid || loading) return;
        setLoading(true);
        setError({ type: null, message: null });

        // getting form data
        const name = name_input_ref.current.value;
        const email = email_input_ref.current.value;
        const password = password_input_ref.current.value;

        const response = await authFetch({ route: "signup", payload: { name, email, password } });

        if (response.code === 201) {
            setUserInput({ name, email, password });
            setLoading(false);
            changePage("otp")
        }
        else {
            setLoading(false);
            let error_type = response.type === "json" ? response.data.type : "server";
            let error_msg = response.type === "json" ? response.data.message : response.data;
            setError({ type: error_type, message: error_msg });
        }
    }

    return (
        <div className='signup'>
            <h4>Sign Up</h4>
            <form action="" onSubmit={handleSubmit}>
                <fieldset disabled={loading}>
                    <InputBox placeholder="Enter name" name="name" input_type="text" default_value={defaultValue?.name} error={error.type === "name" && error.message} ref={name_input_ref} />
                    <div className="domain-info">
                        <span className="info-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                            </svg>
                        </span>
                        <span className="info-short-note">Not all domains are supported</span>
                    </div>
                    <InputBox placeholder="Enter college email Id" name="email" input_type="email" default_value={defaultValue?.email} error={error.type === "email" && error.message} ref={email_input_ref} />
                    <InputBox placeholder="Enter password" name="password" input_type="password" default_value={defaultValue?.password} error={error.type === "password" && error.message} ref={password_input_ref} />
                    <p className="form-error-msg">
                        {error.message && (error.type !== "name" && error.type !== "email" && error.type !== "password") && 
                        <span className="error-text">{error.message}</span>}
                    </p>
                    <SubmitBtn loading={loading} ready_to_submit={isFormValid} />
                </fieldset>
            </form>
            <p className='login'>Already have an account? <span className="login-link" onClick={() => changePage("login", true)}>Login</span></p>
        </div>
    )
}
