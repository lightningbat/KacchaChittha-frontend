import './style.scss'
import InputBox from '../../local_components/input_box'
import SubmitBtn from '../../local_components/submit_btn'
import PropTypes from 'prop-types'

Signup.propTypes = {
    changePage: PropTypes.func
}
export default function Signup({ changePage }) {
    function handleSubmit(event) {
        event.preventDefault();
        changePage("otp")
    }
    return (
        <div className='signup'>
            <h4>Sign Up</h4>
            <form action="" onSubmit={handleSubmit}>
                <fieldset>
                    <InputBox placeholder="Enter name" input_type="text" />
                    <InputBox placeholder="Enter college email Id" input_type="email" />
                    <InputBox placeholder="Enter password" input_type="password" />
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className='login'>Already have an account? <span className="login-link" onClick={() => changePage("login")}>Login</span></p>
        </div>
    )
}