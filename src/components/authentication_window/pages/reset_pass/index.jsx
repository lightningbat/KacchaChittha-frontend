import './style.scss';
import InputBox from '../../local_components/input_box';
import SubmitBtn from '../../local_components/submit_btn';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import authFetch from '../../../../services/auth_fetch';

ResetPass.propTypes = {
    changePage: PropTypes.func,
    user_email: PropTypes.string
}
export default function ResetPass({ changePage, user_email }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ type: null, message: null });
    const [ifResetSuccess, setIfResetSuccess] = useState(false);
    const password_input_ref = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const validateForm = () => {
        const password = password_input_ref.current.value;
        if (password.length > 0) {
            setIsFormValid(true);
        }
        else {
            setIsFormValid(false);
        }
    }

    // input event listeners
    useEffect(() => {
        const password_input = password_input_ref.current;
        password_input.addEventListener("input", validateForm);
        return () => {
            password_input.removeEventListener("input", validateForm);
        }
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        if (!isFormValid || loading) return;
        setLoading(true);
        setError({ type: null, message: null });

        // getting form data
        const password = password_input_ref.current.value;

        const response = await authFetch({ route: "reset-password", payload: { password, email: user_email } });

        if (response.code === 200) {
            setIfResetSuccess(true);
        }
        else {
            setLoading(false);
            let error_type = response.type === "json" ? response.data.type : "server";
            let error_msg = response.type === "json" ? response.data.message : response.data;
            setError({ type: error_type, message: error_msg });
        }
    }
    return (
        <div className="reset-password">
            <h4>Reset Password</h4>
            <p className='email'>{user_email}</p>
            <form action="" onSubmit={handleSubmit} >
                <fieldset disabled={loading}>
                    <InputBox placeholder="Enter new password" name="password" input_type="password" error={error.type === "password" && error.message} ref={password_input_ref} />
                    <p className="form-error-msg">
                        {error.message && (error.type !== "password") && 
                        <span className="error-text">{error.message}</span>}
                    </p>
                    { !ifResetSuccess ?
                        <SubmitBtn loading={loading} ready_to_submit={isFormValid} /> : <div className="btn-done" onClick={() => changePage("login", true)}>Done</div> }
                </fieldset>
            </form>
            <p className="page-change-link">
                <span className="btn" onClick={() => changePage("login", true)}>Login</span>
                &nbsp;/&nbsp;
                <span className="btn" onClick={() => changePage("signup", true)}>Sign Up</span>
            </p>
        </div>
    )
}