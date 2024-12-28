import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

Otp.propTypes = {
    changePage: PropTypes.func,
    redirected_from: PropTypes.string,
    user_email: PropTypes.string
}
export default function Otp({ changePage, redirected_from, user_email="helloworld@kacchachittha.in" }) {
    const [counter, setCounter] = useState(60);
    useEffect(() => {
        if (counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        }
    }, [counter]);
    
    const resetTimer = () => {
        if (counter > 0) return;
        setCounter(60);
    }

    return (
        <div className="otp">
            <h4>Enter OTP</h4>
            <p className='description'>Enter the OTP sent to your email.</p>
            <p className='user-email'>{user_email}</p>
            <form action="" onSubmit={(e) => e.preventDefault()}>
                <fieldset>
                    <InputBox placeholder="Enter OTP" input_type="text" />
                    <p className="resent-otp-label">Didn&#39;t receive OTP?</p>
                    <p className='resent-otp'>
                        <span className="btn" onClick={resetTimer}>Resend</span>
                        {counter > 0 && <span className="timer"> in {counter}</span>}
                    </p>
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className='edit-email'>Entered wrong email id? <span className="edit-email-btn" onClick={() => changePage(redirected_from)}>Edit</span></p>
        </div>
    )
}