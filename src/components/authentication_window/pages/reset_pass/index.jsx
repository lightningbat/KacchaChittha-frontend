import './style.scss';
import InputBox from '../../local_components/input_box';
import SubmitBtn from '../../local_components/submit_btn';
import PropTypes from 'prop-types';

ResetPass.propTypes = {
    changePage: PropTypes.func,
    email: PropTypes.string
}
export default function ResetPass({ changePage, email }) {
    return (
        <div className="reset-password">
            <h4>Reset Password</h4>
            <p className='email'>{email || "helloworld@kacchachittha.in"}</p>
            <form action="" onSubmit={(e) => e.preventDefault()} >
                <fieldset>
                    <InputBox placeholder="Enter new password" input_type="password" />
                    <SubmitBtn />
                </fieldset>
            </form>
            <p className="page-change-link">
                <span className="btn" onClick={() => changePage("login")}>Login</span>
                &nbsp;/&nbsp;
                <span className="btn" onClick={() => changePage("signup")}>Sign Up</span>
            </p>
        </div>
    )
}