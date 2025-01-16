import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import authFetch from '../../../../services/auth_fetch'

Otp.propTypes = {
    changePage: PropTypes.func,
    redirected_from: PropTypes.string,
    user_email: PropTypes.string,
    closeWindow: PropTypes.func
}
export default function Otp({ changePage, redirected_from, user_email, closeWindow }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ type: null, message: null });
    const [counter, setCounter] = useState(60);

    useEffect(() => {
        if (counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        }
    }, [counter]);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError({ type: null, message: null });

        // getting otp from form
        const otp = event.target[1].value;

        const response = await authFetch({ route: "verify-otp", payload: { otp, email: user_email } });

        if (response.code === 200) {
            if (otp < 5000) closeWindow(true);
            else changePage("reset_pass", true);
        }
        else {
            setLoading(false);
            let error_type = response.type === "json" ? response.data.type : "server";
            let error_msg = response.type === "json" ? response.data.message : response.data;
            setError({ type: error_type, message: error_msg });
        }
    }

    async function resendOTP() {
        if (counter > 0 || loading) return;

        const response = await authFetch({ route: "resend-otp", payload: { email: user_email } });
        if (response.code === 201) {
            setCounter(60);
        }
        else {
            let error_type = response.type === "json" ? response.data.type : "server";
            let error_msg = response.type === "json" ? response.data.message : response.data;
            setError({ type: error_type, message: error_msg });
        }
    }

    return (
        <div className="otp">
            <h4>OTP</h4>
            <p className='description'>Enter the OTP sent to your email.</p>
            <p className='user-email'>{user_email}</p>
            <form action="" onSubmit={handleSubmit}>
                <fieldset disabled={loading}>
                    <InputBox placeholder="Enter OTP" input_type="text" name="otp" error={error.type === "otp" && error.message} />
                    <p className="resent-otp-label">Didn&#39;t receive OTP?</p>
                    <p className="trash-folder-mention">Did you check your email&apos;s trash folder? Sometimes important messages end up there.</p>
                    <p className='resent-otp no-select'>
                        <span className="btn" onClick={resendOTP}>Resend</span>
                        {counter > 0 && <span className="timer"> in {counter}</span>}
                    </p>
                    <p className="form-error-msg">
                        {error.message && (error.type !== "otp") && 
                        <span className="error-text">{error.message}</span>}
                    </p>
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className='edit-email'>Entered wrong email id? <span className="edit-email-btn" onClick={() => changePage(redirected_from)}>Edit</span></p>
        </div>
    )
}