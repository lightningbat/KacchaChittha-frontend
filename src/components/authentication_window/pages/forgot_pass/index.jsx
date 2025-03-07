import './style.scss';
import InputBox from '../../local_components/input_box';
import SubmitBtn from '../../local_components/submit_btn';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import authFetch from '../../../../services/auth_fetch';

ForgotPass.propTypes = {
    changePage: PropTypes.func,
    defaultValue: PropTypes.object,
    setUserInput: PropTypes.func
}
export default function ForgotPass({ changePage, defaultValue, setUserInput }) {
    const [error, setError] = useState({ type: null, message: null });
    const [loading, setLoading] = useState(false);
    const email_input_ref = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const validateForm = () => {
        const email = email_input_ref.current.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // This regex matches a basic email format
        const isValidEmail = emailRegex.test(email);
        if (isValidEmail) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }

    // input event listeners
    useEffect(() => {
        const email_input = email_input_ref.current;
        email_input.addEventListener("input", validateForm);

        // initial validation, in case user has entered data before
        validateForm();
        
        return () => {
            email_input.removeEventListener("input", validateForm);
        }
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError({ type: null, message: null });

        // getting form data
        const email = event.target[1].value;

        const response = await authFetch({ route: "forgot-password", payload: { email } });

        if (response.code === 201) {
            setUserInput({ email });
            changePage("otp");
        }
        else {
            setLoading(false);
            let error_type = response.type === "json" ? response.data.type : "server";
            let error_msg = response.type === "json" ? response.data.message : response.data;
            setError({ type: error_type, message: error_msg });
        }
    }
    return (
        <div className="forgot-password">
            <h4>Forgot Password?</h4>
            <p className='description'>Enter the email associated with your account.</p>
            <form action="" onSubmit={handleSubmit}>
                <fieldset disabled={loading}>
                    <InputBox placeholder="Enter email" name="email" input_type="email" default_value={defaultValue?.email} error={error.type === "email" && error.message} ref={email_input_ref} />
                    <p className="form-error-msg">
                        {error.message && (error.type !== "email") && 
                        <span className="error-text">{error.message}</span>}
                    </p>
                    <SubmitBtn loading={loading} ready_to_submit={isFormValid} />
                </fieldset>
            </form>
            <p className='login'>Remember it? <span className="login-link" onClick={() => changePage("login", true)}>Login</span></p>
        </div>
    )
}