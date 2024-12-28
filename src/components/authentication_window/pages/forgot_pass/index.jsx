import './style.scss';
import InputBox from '../../local_components/input_box';
import SubmitBtn from '../../local_components/submit_btn';
import PropTypes from 'prop-types';

ForgotPass.propTypes = {
    changePage: PropTypes.func
}
export default function ForgotPass({ changePage }) {
    function handleSubmit(event) {
        event.preventDefault();
        changePage("otp")
    }
    return (
        <div className="forgot-password">
            <h4>Forgot Password?</h4>
            <p className='description'>Enter the email associated with your account.</p>
            <form action="" onSubmit={handleSubmit}>
                <fieldset>
                    <InputBox placeholder="Enter email" input_type="email" />
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className='login'>Remember it? <span className="login-link" onClick={() => changePage("login")}>Login</span></p>
        </div>
    )
}