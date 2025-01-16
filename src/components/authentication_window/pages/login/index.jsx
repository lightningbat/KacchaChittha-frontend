import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'
import { useState } from 'react'
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

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError({ type: null, message: null });

        // getting form data
        const email = event.target[1].value;
        const password = event.target[2].value;

        const response = await authFetch({ route: "login", payload: { email, password } });

        if (response.code === 200 || response.code === 202) {
            if (response.code === 200) closeWindow(true);
            else {
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
                    <InputBox  placeholder="Enter college email Id" name="email" input_type="email" default_value={defaultValue?.email} error={error.type === "email" && error.message} />
                    <InputBox placeholder="Enter password" name="password" input_type="password" default_value={defaultValue?.password} error={error.type === "password" && error.message} />
                    <span className="forgot-password" onClick={() => changePage("forgot_pass")}>Forgot Password?</span>
                    <p className="form-error-msg">
                        {error.message && (error.type !== "email" && error.type !== "password") && 
                        <span className="error-text">{error.message}</span>}
                    </p>
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className='signup'>Don&#39;t have an account? <span className="signup-link" onClick={() => changePage("signup", true)}>Sign Up</span></p>
        </div>
    )
}