import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'

Login.propTypes = {
    changePage: PropTypes.func
}
export default function Login({ changePage }) {
    return (
        <div className="login">
            <h4>Login</h4>
            <form action="" onSubmit={(e) => e.preventDefault()}>
                <fieldset>
                    <InputBox  placeholder="Enter college email Id" input_type="email" />
                    <InputBox placeholder="Enter password" input_type="password" />
                    <span className="forgot-password" onClick={() => changePage("forgot_pass")}>Forgot Password?</span>
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className='signup'>Don&#39;t have an account? <span className="signup-link" onClick={() => changePage("signup")}>Sign Up</span></p>
        </div>
    )
}