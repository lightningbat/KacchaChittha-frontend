import { Spinner } from '../../../../custom/loading_animations'
import './style.scss'
import PropTypes from 'prop-types'

SubmitBtn.propTypes = {
    loading: PropTypes.bool,
    ready_to_submit: PropTypes.bool
}
export default function SubmitBtn({loading, ready_to_submit}) {
    return (
        <div className="submit-btn-cont">
            {!loading && <button disabled={!ready_to_submit} className="authentication submit-btn no-select" type="submit">Submit</button>}
            {loading && <Spinner scale={0.5} thickness={2} color="#31a754" />}
        </div>
    )
}