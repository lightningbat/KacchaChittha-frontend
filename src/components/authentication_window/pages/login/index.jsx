import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import authFetch from '../../../../services/auth_fetch'

Login.propTypes = {
    defaultValue: PropTypes.object,
    setUserInput: PropTypes.func,
    changePage: PropTypes.func,
    closeWindow: PropTypes.func
}
export default function Login({ defaultValue, setUserInput, changePage, closeWindow }) {
    const [error, setError] = useState({ type: null, message: null });
    const [loading, setLoading] = useState(false);
    const email_input_ref = useRef(null);
    const password_input_ref = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const validateForm = () => {
        const email = email_input_ref.current.value;
        const password = password_input_ref.current.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // This regex matches a basic email format

        if (emailRegex.test(email) && password.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }

    // input event listeners
    useEffect(() => {
        const email_input = email_input_ref.current;
        const password_input = password_input_ref.current;

        email_input.addEventListener("input", validateForm);
        password_input.addEventListener("input", validateForm);

        // initial validation, in case user has entered data before
        validateForm();

        return () => {
            email_input.removeEventListener("input", validateForm);
            password_input.removeEventListener("input", validateForm);
        }
    }, [])


    async function handleSubmit(event) {
        event.preventDefault();
        if (!isFormValid || loading) return;
        setLoading(true);
        setError({ type: null, message: null });

        // getting form data
        const email = email_input_ref.current.value;
        const password = password_input_ref.current.value;

        const response = await authFetch({ route: "login", payload: { email, password } });

        if (response.code === 200 || response.code === 202) {
            if (response.code === 200) closeWindow(true);
            else { // user is not verified
                setUserInput({ email, password });
                changePage("otp");
            }
        }
        else {
            setLoading(false);
            let error_type = response.type === "json" ? response.data.type : "server";
            let error_msg = response.type === "json" ? response.data.message : response.data;
            setError({ type: error_type, message: error_msg });
        }
    }

    return (
        <div className="login">
            <h4>Login</h4>
            <form action="" onSubmit={handleSubmit}>
                <fieldset disabled={loading}>
                    <InputBox  placeholder="Enter college email Id" name="email" input_type="email" default_value={defaultValue?.email} error={error.type === "email" && error.message} ref={email_input_ref} />
                    <InputBox placeholder="Enter password" name="password" input_type="password" default_value={defaultValue?.password} error={error.type === "password" && error.message} ref={password_input_ref} />
                    <span className="forgot-password" onClick={() => changePage("forgot_pass")}>Forgot Password?</span>
                    <p className="form-error-msg">
                        {error.message && (error.type !== "email" && error.type !== "password") && 
                        <span className="error-text">{error.message}</span>}
                    </p>
                    <SubmitBtn loading={loading} ready_to_submit={isFormValid} />
                </fieldset>
            </form>
            <p className='signup'>Don&#39;t have an account? <span className="signup-link" onClick={() => changePage("signup", true)}>Sign Up</span></p>
        </div>
    )
}